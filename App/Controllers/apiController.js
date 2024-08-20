//const sql = require('msnodesqlv8');
const path = require('path');
const { decrypt } = require('../Util/dataHandling');
const { Character } = require('../Model/character');
const { Message } = require('../Util/message');
const { SqlServer } = require('../Util/SqlServer');
const fs = require('fs');
const { promisify } = require('util');

const dbConfig = process.env.DB_CONNECTION;

class APIController {
    static async getCharacter(req, res) {
        try {
            const characterName = decrypt(req.query.q, process.env.PORTAL_KEY, process.env.PORTAL_IV);
            const character = new Character(characterName);

            if (req.query.type === 'json') {
                res.json(character.toJSON());
            } else {
                res.type('text/plain');
                res.send(character.toArray().join('\n'));
            }
        } catch (err) {
            res.status(500).send('Error: ' + err.message);
        }
    }

    static async deleteCharacter(req, res) {
        try {
            const message = new Message();
            message.unserialize(req.body.message);

            const characterName = decrypt(decodeURIComponent(message.character),
                process.env.PORTAL_KEY, process.env.PORTAL_IV);
            const character = new Character(characterName);
            const characterData = character.toArray().join('\n');

            const sql = new SqlServer(process.env.DB_CONNECTION);

            // Fetch AuthId and ContainerId
            const [rows] = await sql.dbquery(
                'SELECT AuthId, ContainerId FROM cohdb.dbo.Ents WHERE Name = ?',
                [characterName]
            );

            if (rows.length === 0) {
                throw new Error('Character not found');
            }

            const [authId, containerId] = [rows[0].AuthId, rows[0].ContainerId];

            // Check if any characters are logged in
            const activeCharacters = await sql.dbquery(
                'SELECT 1 FROM cohdb.dbo.Ents WHERE AuthId = ? AND Active > 0',
                [authId]
            );

            if (activeCharacters.length > 0) {
                throw new Error('Account must be logged off.');
            }

            // Check transfer lock
            const transferLock = await sql.dbquery(
                'SELECT AccSvrLock FROM cohdb.dbo.Ents2 WHERE ContainerId = ? AND AccSvrLock IS NOT NULL',
                [containerId]
            );

            if (transferLock.length === 0) {
                throw new Error('The transfer lock does not appear to be in place, the request cannot proceed.');
            }

            // Ensure backups directory exists and is writable
            const backupDir = path.join(__dirname, '..', 'backups', character.authName);
            await promisify(fs.mkdir)(backupDir, { recursive: true });

            const backupFile = path.join(
                backupDir,
                `${character.name.replace(/[^a-z0-9]+/g, '-')}.${md5(characterData)}.txt`
            );

            await promisify(fs.writeFile)(backupFile, characterData);

            // Hide the character by setting AuthId to a negative value
            await sql.dbquery(
                'UPDATE cohdb.dbo.Ents SET AuthId = ? WHERE Name = ?',
                [-authId, character.name]
            );

            // Remove transfer block
            await sql.dbquery(
                'UPDATE cohdb.dbo.Ents2 SET AccSvrLock = null WHERE ContainerId = ?',
                [containerId]
            );

            res.send('Success');
        } catch (err) {
            res.status(500).send('Failure: ' + err.message);
        }
    }
}

module.exports = APIController;