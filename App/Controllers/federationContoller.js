const sql = require('msnodesqlv8');
const { decrypt } = require('../Util/dataHandling');
const Message = require('../Util/message');
const Character = require('../Model/character');
const Http = require('../util/Http');
const DBFlag = require('../Bitfield/DBFlag');

class FederationController {
    /**
     * Create a character transfer request.
     * 
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async transferCharacterRequest(req, res) {
        const connectionString = process.env.DB_CONNECTION;

        // If person is online, tell them to get off first
        if (req.session?.account?.isOnline()) {
            return res.render('core/page-generic-message.pug', {
                title: 'Log Off First',
                message: 'You must log out of the game before you can initiate a character transfer.'
            });
        }

        const characterName = decrypt(decodeURIComponent(req.body.character), process.env.PORTAL_KEY, process.env.PORTAL_IV);

        try {
            // Get the character's ContainerId
            const containerId = await this.queryDatabase(connectionString, 'SELECT ContainerId FROM cohdb.dbo.Ents WHERE Name = ?', [characterName]);

            // If the character is locked for transfer already, abort
            const isLocked = await this.queryDatabase(connectionString, 'SELECT AccSvrLock FROM cohdb.dbo.Ents2 WHERE ContainerId = ? AND AccSvrLock IS NOT NULL', [containerId]);
            if (isLocked.length > 0) {
                return res.render('core/page-generic-message.pug', {
                    title: 'Character Locked',
                    message: 'This character is locked for transfer. If this is in error, please contact a GM.'
                });
            }

            const fedServer = this.findFederationServerByName(req.body.server);
            const myUsername = req.session.account.getUsername();
            const myPassword = req.session.account.getPassword();

            const login = new Message(req.body.server);
            login.username = myUsername;
            login.password = myPassword;
            login.action = 'PullCharacter';
            login.character = req.body.character;

            // Lockout the character
            await this.queryDatabase(connectionString, 'UPDATE cohdb.dbo.Ents2 SET AccSvrLock = ? WHERE ContainerId = ?', [substr('transfer to ' + fedServer.Name, 0, 72), containerId]);

            return res.redirect(`${fedServer.Url}/federation/login?message=${encodeURIComponent(JSON.stringify(login))}`);
        } catch (error) {
            global.appLogger.error(`federationController transferCharacterRequest: ${error}`);
            return res.render('core/page-generic-message.pug', {
                title: 'An Error was encountered',
                message: `${error.message}<br><pre>${error.stack}</pre>`
            });
        }
    }

    /**
     * Attempts to log you in automatically; if it fails redirects you to the portal's normal login page.
     * After, character transfer request will proceed.
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    async login(req, res) {
        try {
            const message = Message.fromJSON(req.query.message);
            const gameAccount = new GameAccount(message.username);

            if (gameAccount.verifyHashedPassword(message.password)) {
                req.session.account = gameAccount;
                req.session.pullcharacter = { character: message.character, from: message.from };

                return res.redirect('review-policy');
            } else {
                req.session.nextpage = 'federation/review-policy';
                req.session.pullcharacter = { character: message.character, from: message.from };

                return res.redirect(`${process.env.PORTAL_URL}login`);
            }
        } catch (err) {
            global.appLogger.warn(err);
            return res.redirect(`${process.env.PORTAL_URL}login`);
        }
    }

    /**
     * Show the review policy page for the character transfer.
     * @param {*} req HTTP request object
     * @param {*} res HTTP response object
     * @returns 
     */
    async reviewPolicy(req, res) {
        if (!req.session.pullcharacter || !req.session.account) {
            throw new Error('Your session is not correct or has expired.');
        }

        const fedServer = this.findFederationServerByName(req.session.pullcharacter.from);

        return res.render('core/page-federation-review-policy.pug', {
            Server: fedServer,
            character: req.session.pullcharacter.character
        });
    }

    async pullCharacter(req, res) {
        const connectionString = process.env.DB_CONNECTION;

        try {
            if (!req.session.pullcharacter || !req.session.account) {
                throw new Error('Your session is not correct or has expired.');
            }

            const fedServer = this.findFederationServerByName(req.session.pullcharacter.from);

            const rawData = await Http.get(`${fedServer.Url}/api/character/raw?q=${req.session.pullcharacter.character}`);
            const character = new Character();
            character.setArray(rawData.split('\n'));

            // Apply to the correct account
            character.AuthId = req.session.account.getUID();
            character.AuthName = req.session.account.getUsername();

            // Apply policies
            if (fedServer.Policy.AllowTransfers === false) {
                throw new Error(`Character transfer failed: Policy on this system forbids characters originating on ${fedServer.Name}`);
            }

            if (fedServer.Policy.ForceInfluence !== -1) {
                character.InfluencePoints = fedServer.Policy.ForceInfluence;
            }

            if (fedServer.Policy.ForceAccessLevel !== -1) {
                character.AccessLevel = fedServer.Policy.ForceAccessLevel;

                // Strip some admin bits
                const dbf = new DBFlag(character.DbFlags);
                dbf.clear(DBFlag.DBFLAG_UNTARGETABLE);
                dbf.clear(DBFlag.DBFLAG_INVINCIBLE);
                dbf.clear(DBFlag.DBFLAG_INVISIBLE);
                character.DbFlags = dbf.getValue();
            }

            if (fedServer.Policy.ForceDefaultMap) {
                character.StaticMapId = 83; // Pocket D
                delete character.MapId;
                delete character.PosX;
                delete character.PosY;
                delete character.PosZ;
                delete character.OrientP;
                delete character.OrientY;
                delete character.OrientR;
            }

            if (fedServer.Policy.AllowInventory === false) {
                delete character.InvSalvage0;
                delete character.InvRecipeInvention;
            }

            if (await this.queryDatabase(connectionString, 'SELECT 1 FROM cohdb.dbo.Ents WHERE Name = ?', [character.Name]).length > 0) {
                const dbf = new DBFlag(character.DbFlags);
                dbf.set(DBFlag.DBFLAG_RENAMEABLE);
                character.DbFlags = dbf.getValue();
            }

            // Complete the transfer
            const message = new Message(fedServer.Name);
            message.character = req.session.pullcharacter.character;

            if (fedServer.Policy.DeleteOnTransfer) {
                const result = await Http.post(`${fedServer.Url}/api/character/delete`, { message: JSON.stringify(message) });
                if (result !== 'Success') {
                    throw new Error('Deleting character from the remote server failed.');
                }
            } else {
                await Http.post(`${fedServer.Url}/federation/clear-transfer`, { character: req.session.pullcharacter.character, skipredirect: 'true' });
            }

            // Put the character into the database
            await character.putCharacter();
            global.appLogger.info(`${character.Name} has been transferred successfully!`);
            return res.render('core/page-generic-message.pug', {
                title: `Welcome to ${process.env.PORTAL_NAME}`,
                message: `${character.Name} has been transferred successfully!`
            });
        } catch (error) {
            global.appLogger.error(`federationController pullcharacter: ${error}`);
            return res.render('core/page-generic-message.pug', {
                title: 'An Error was encountered',
                message: `${error.message}<br><pre>${error.stack}</pre>`
            });
        }
    }

    async clearTransfer(req, res) {
        const connectionString = process.env.DB_CONNECTION;

        try {
            await this.queryDatabase(connectionString, 'UPDATE cohdb.dbo.Ents2 SET AccSvrLock = null FROM cohdb.dbo.Ents INNER JOIN cohdb.dbo.Ents2 ON Ents.ContainerId = Ents2.ContainerId WHERE Ents.Name = ?',
                [decrypt(decodeURIComponent(req.body.character), process.env.PORTAL_KEY, process.env.PORTAL_IV)]);

            if (!req.body.skipredirect) {
                return res.redirect(`${process.env.PORTAL_URL}manage`);
            } else {
                return res.status(200).send('Success');
            }
        } catch (error) {
            global.appLogger.error(`federationController clearTransfer: ${error}`);
            return res.status(500).send(`Error: ${error.message}`);
        }
    }

    async queryDatabase(connectionString, query, params) {
        return new Promise((resolve, reject) => {
            sql.query(connectionString, query, params, (err, rows) => {
                if (err) {
                    global.appLogger.error(`federationController queryDatabase: ${err}`);
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    findFederationServerByName(name) {
        const federationServers = global.federation; // or require a config file
        const server = federationServers.find(item => item.Name.toLowerCase().includes(name.toLowerCase()));

        if (!server) {
            throw new Error(`Unable to locate federated server by name: ${name}. Please ensure the configuration has an entry for ${name}.`);
        }

        return server;
    }
}

module.exports = FederationController;
