const sql = require('msnodesqlv8');
const DataHandling = require('../Util/dataHandling.js');
const { promisify } = require('util');

/**
 * Class representing a game account with operations related to account management and character information.
 * 
 * @property {string|null} username   The username of the account.
 * @property {number|null} uid        The unique identifier of the account.
 * @property {string|null} lastIp     The last IP address used by the account.
 * @property {Date|null}   lastLogin  The last login date of the account.
 * @property {Date|null}   lastLogout The last logout date of the account.
 */
class GameAccount {
    /**
     * Constructor for the GameAccount class.
     * 
     * @param {string|number} username The user identifier to create the GameAccount object
     */
    constructor(username) {
        this.username = null;
        this.uid = null;
        this.lastIp = null;
        this.lastLogin = null;
        this.lastLogout = null;

        if (username !== null || username !== undefined) {
            if (typeof username === 'number') {
                this.fetchAccountByUid(username);
            } else if (typeof username === 'string' && username.trim() !== '') {
                this.fetchAccountByUsername(username);
            }
        }
    }

    /**
     * Executes a SQL query with parameters.
     * 
     * @param {string} query The SQL query to execute.
     * @param {Array} [params=[]] The parameters for the SQL query.
     * @returns {Promise<Array>} The result rows from the SQL query.
     */
    executeQuery(query, params = []) {
        let logger = global.appLogger;
        return new Promise((resolve, reject) => {
            sql.query(process.env.DB_CONNECTION, query, params, (err, rows) => {
                if (err) {
                    logger.error('SQL error:', err);
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    /**
    * Fetches account details by UID.
    * 
    * @param {number} uid The UID of the account to fetch.
    * @throws {Error} If an error occurs during the database operation.
    */
    async fetchAccountByUid(uid) {
        let rows;
        try {
            rows = await this.executeQuery(
                `SELECT a.account, a.uid, a.last_login, a.last_logout, a.last_ip
                FROM cohauth.dbo.user_account a 
                INNER JOIN cohauth.dbo.user_auth b ON a.account = b.account WHERE a.uid = ?`,
                [uid]
            );
            if (rows.length > 0) {
                const row = rows[0];
                this.username = row.account;
                this.uid = row.uid;
                this.lastIp = row.last_ip;
                this.lastLogin = row.last_login;
                this.lastLogout = row.last_logout;
            }
        } catch (error) {
            throw new Error('Error fetching account by UID');
        }
    }

    /**
     * Fetches account details by username.
     * 
     * @param {string} username The username of the account to fetch.
     * @throws {Error} If an error occurs during the database operation.
     */
    async fetchAccountByUsername(username) {
        let rows;
        try {
            rows = await this.executeQuery(
                `SELECT a.account, a.uid, a.last_login, a.last_logout, a.last_ip
                 FROM cohauth.dbo.user_account a INNER JOIN cohauth.dbo.user_auth b ON a.account = b.account 
                 WHERE UPPER(b.account) = UPPER(?)`,
                [username]
            );
            if (rows.length > 0) {
                const row = rows[0];
                this.username = row.account;
                this.uid = row.uid;
                this.lastIp = row.last_ip;
                this.lastLogin = row.last_login;
                this.lastLogout = row.last_logout;
            }
        } catch (error) {
            throw new Error('Error fetching account by username');
        }
    }

    /**
     * Creates a new game account with the given username and password.
     * 
     * @param {string} username The username for the new account.
     * @param {string} password The password for the new account.
     * @throws {Error} If an error occurs during the account creation process.
     */
    async create(username, password) {
        let logger = global.appLogger;
        DataHandling.validateUsername(username);
        DataHandling.validatePassword(password);

        const connection = promisify(sql.open);
        let conn;
        try {
            conn = await connection(process.env.DB_CONNECTION);

            // Check username uniqueness
            const usernameCheckQuery = 'SELECT 1 FROM cohauth.dbo.user_account WHERE UPPER(account) = UPPER(?)';
            const usernameExists = await promisify(conn.query.bind(conn))(usernameCheckQuery, [username]);

            if (usernameExists.length > 0) {
                throw new Error('taken');
            }

            // Generate new account ID
            const uidQuery = 'SELECT max(uid) + 1 FROM cohauth.dbo.user_account';
            const uidResult = await promisify(conn.query.bind(conn))(uidQuery);
            let uid = uidResult[0].Column0;

            if (uid === null) {
                uid = 10;
            }

            const hash = DataHandling.binPassword(username, password);

            // Convert hexadecimal string to a binary buffer (ensure length matches binary(16))
            const binaryData = Buffer.from(process.env.user_data.substring(2), 'hex');

            // SQL statements to execute
            const sql1 = 'INSERT INTO cohauth.dbo.user_account (account, uid, forum_id, pay_stat) VALUES (?, ?, ?, 1014)';
            const sql2 = `INSERT INTO cohauth.dbo.user_auth (account, password, salt, hash_type) VALUES (?, CONVERT(BINARY(128),'${hash}'), 0, 1)`;
            const sql3 = 'INSERT INTO cohauth.dbo.user_data (uid, user_data) VALUES (?, CONVERT(binary(16), ?, 1))';
            const sql4 = 'INSERT INTO cohauth.dbo.user_server_group (uid, server_group_id) VALUES (?, 1)';

            // Insert database data
            await promisify(conn.beginTransaction.bind(conn))();
            await promisify(conn.query.bind(conn))(sql1, [username, uid, uid]);
            await promisify(conn.query.bind(conn))(sql2, [username]);
            await promisify(conn.query.bind(conn))(sql3, [uid, binaryData]);
            await promisify(conn.query.bind(conn))(sql4, [uid]);
            await promisify(conn.commit.bind(conn))();
            this.username = username;
        } catch (err) {
            if (conn) {
                await promisify(conn.rollback.bind(conn))();
            }
            logger.error('Error creating account:', err);
            let message = err.message === "taken" ?
                "The account name you entered has already been taken." :
                "Unable to create your account; something went wrong.";
            throw new Error(message);
        } finally {
            if (conn) {
                conn.close();
            }
        }
    }

    /**
     * Logs in a user with the provided username and password.
     * 
     * @param {string} username The username of the account.
     * @param {string} password The password of the account.
     */
    async login(username, password) {
        try {
            DataHandling.validateUsername(username);
            DataHandling.validatePassword(password);

            const hash = DataHandling.binPassword(username, password);

            const rows = await this.executeQuery(
                `SELECT a.account, a.uid, a.last_login, a.last_logout, a.last_ip
                FROM cohauth.dbo.user_account a
                INNER JOIN cohauth.dbo.user_auth b ON a.account = b.account
                WHERE UPPER(b.account) = UPPER(?) AND CONVERT(VARCHAR, b.password) = SUBSTRING(?, 1, 30)`,
                [username, hash]
            );
            if (rows.length > 0) {
                const row = rows[0];
                this.username = row.account;
                this.uid = row.uid;
                this.lastIp = row.last_ip;
                this.lastLogin = row.last_login;
                this.lastLogout = row.last_logout;
            } else {
                global.appLogger.warn(`Failed login for account ${username}`);
                throw new Error('That username and password does not match our records.');
            }
        } catch (error) {
            throw new Error('Error logging in');
        }
    }

    /**
     * Changes the password for the current account.
     * 
     * @param {string} newPassword The new password for the account.
     * @throws {Error} If an error occurs during the password change process.
     */
    async changePassword(newPassword) {
        try {
            DataHandling.validatePassword(newPassword);
            const hash = `${DataHandling.binPassword(this.username, newPassword)}`;
            await this.executeQuery(
                `UPDATE cohauth.dbo.user_auth SET password = CONVERT(BINARY(128), '${hash}') WHERE UPPER(account) = UPPER(?)`,
                [this.username]
            );
        } catch (error) {
            throw new Error('Error changing password');
        }
    }

    /**
     * Retrieves the list of characters associated with the current account.
     * 
     * @throws {Error} If an error occurs during the character retrieval process.
     * @returns {Array} An array of character objects containing character details.
     */
    async getCharacterList() {
        try {
            const rows = await this.executeQuery(
                'SELECT Supergroups.Name AS SupergroupName, Attributes.Name AS ClassName, Attributes_1.Name AS OriginName, CONVERT(varchar, Ents.LastActive, 101) AS LastPlayed, Ents.*, Ents2.* FROM cohdb.dbo.Ents INNER JOIN cohdb.dbo.Ents2 ON Ents.ContainerId = Ents2.ContainerId INNER JOIN cohdb.dbo.Attributes ON Ents.Class = Attributes.Id INNER JOIN cohdb.dbo.Attributes AS Attributes_1 ON Ents.Origin = Attributes_1.Id LEFT OUTER JOIN cohdb.dbo.Supergroups ON Ents.SupergroupsId = Supergroups.ContainerId WHERE (Ents.AuthId = ?) AND Ents2.AccSvrLock IS NULL',
                [this.uid]
            );
            return rows.map(row => {
                row.datauri = encodeURIComponent(DataHandling.encrypt(row.Name, process.env.portal_key, process.env.portal_iv));
                return row;
            });
        } catch (error) {
            throw new Error('Error retrieving character list');
        }
    }

    /**
    * Retrieves the list of locked characters associated with the current account.
    * 
    * @returns {Array} The list of locked characters for the account.
    */
    async getLockedCharacters() {
        try {
            const rows = await this.executeQuery(
                'SELECT Supergroups.Name AS SupergroupName, Attributes.Name AS ClassName, Attributes_1.Name AS OriginName, Ents.*, Ents2.* FROM cohdb.dbo.Ents INNER JOIN cohdb.dbo.Ents2 ON Ents.ContainerId = Ents2.ContainerId INNER JOIN cohdb.dbo.Attributes ON Ents.Class = Attributes.Id INNER JOIN cohdb.dbo.Attributes AS Attributes_1 ON Ents.Origin = Attributes_1.Id LEFT OUTER JOIN cohdb.dbo.Supergroups ON Ents.SupergroupsId = Supergroups.ContainerId WHERE (Ents.AuthId = ?) AND Ents2.AccSvrLock LIKE ?',
                [this.uid, 'transfer%']
            );
            return rows.map(row => {
                row.datauri = encodeURIComponent(DataHandling.encrypt(row.Name, process.env.portal_key, process.env.portal_iv));
                return row;
            });
        } catch (error) {
            throw new Error('Error retrieving locked characters');
        }
    }

    /**
     * Retrieves the username for the current account.
     * 
     * @returns {string} The username of the account.
     */
    getUsername() {
        return this.username;
    }

    /**
    * Retrieves the hashed password for the current account.
    * 
    * @returns {string|undefined} The hashed password, or undefined if not found.
    */
    async getPassword() {
        const rows = await this.executeQuery(
            'SELECT CONVERT(VARCHAR, password) AS pass FROM cohauth.dbo.user_auth WHERE UPPER(account) = UPPER(?)',
            [this.username]
        );
        return rows[0]?.pass;
    }

    /**
     * Verifies if the given hashed password matches the stored password for the current account.
     * 
     * @param {string} hashedPassword The hashed password to verify.
     * @returns {boolean} True if the hashed password matches, false otherwise.
     */
    async verifyHashedPassword(hashedPassword) {
        const rows = await this.executeQuery(
            'SELECT 1 FROM cohauth.dbo.user_auth WHERE UPPER(account) = UPPER(?) AND CONVERT(VARCHAR, password) = ?',
            [this.username, hashedPassword]
        );
        return rows.length > 0;
    }

    /**
     * Retrieves the UID for the current account.
     * 
     * @returns {Promise<number|null>} The UID of the account, or null if not set.
     */
    getUID() {
        return this.uid;
    }

    /**
    * Checks if the current account is online.
    * 
    * @returns {boolean} True if the account is online, false otherwise.
    */
    async isOnline() {
        const rows = await this.executeQuery(
            'SELECT 1 FROM cohdb.dbo.Ents WHERE AuthId = ? AND Active > 0',
            [this.uid]
        );
        return rows.length > 0;
    }

    /**
    * Checks if the current account has admin privileges.
    * 
    * @returns {boolean} True if the account is an admin, false otherwise.
    */
    async isAdmin() {
        const rows = await this.executeQuery(
            'SELECT 1 FROM cohdb.dbo.Ents WHERE AuthId = ? AND AccessLevel >= 10',
            [this.uid]
        );
        return rows.length > 0;
    }

    /**
     * Ban the account from playing.
     * 
     * @todo Not even sure this is correct, need to check SQL query and test.
     * @note It's a working template to fix up later.
     * @param {string} date - Date to ban account until (optional)
     */
    async banAccount(date) {
        try {
            if (date === null || date === undefined || date === '') {
                // 100 year ban
                date = new Date(new Date().setFullYear(new Date().getFullYear() + 100))
                    .toISOString().slice(0, 19).replace('T', ' ');
            } else {
                date = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
            }
            // SQL execute query to set block_end_date using date
            await this.executeQuery(
                'UPDATE cohauth.dbo.user_account SET block_end_date = ? WHERE UPPER(account) = UPPER(?)',
                [date, this.username]
            );

            await this.executeQuery(
                'UPDATE cohauth.dbo.user_account SET block_flag = 1 WHERE UPPER(account) = UPPER(?)',
                [this.username]
            );
        } catch (error) {
            throw new Error('Error banning account');
        }
    }
}

module.exports = GameAccount;