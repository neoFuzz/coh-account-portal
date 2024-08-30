const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Represents a character in the system.
 */
class Character {
    /**
     * Creates an instance of the Character class.
     * @param {string} [name=''] - The name of the character to load.
     * @param {boolean} [persistent=false] - Whether the character is persistent.
     */
    constructor(name = '', persistent = false) {
        this.results = [];
        this.constructed = [];
        this.persistent = persistent;
        this.attributes = {};

        if (name) {
            try {
                this.loadCharacter(name);
            } catch (error) {
                global.appLogger.error('Character(): ', error);
            }
        }
    }

    /**
    * Loads a character from the database.
    * @param {string} name - The name of the character to load.
    * @returns {Promise<void>}
    * @throws {Error} If the character does not exist.
    */
    async loadCharacter(name) {
        const exists = await this.checkCharacterInDB(name);

        if (exists) {
            const cmd = `${process.env.DBQUERY} -getcharacter "${this.escapeShellArg(name)}"`;
            global.appLogger.info("Running loadcharacter...")
            this.results = this.execCommand(cmd).split('\n');
            this.parseResults();
            this.blacklistEntries();
        } else {
            throw new Error(`No such character "${name}"`);
        }
    }

    /**
     * Escapes shell arguments to prevent injection.
     * @param {string} arg - The argument to escape.
     * @returns {string} The escaped argument.
     */
    escapeShellArg(arg) {
        return arg.replace(/'/g, "'\\''"); // Escape single quotes
    }

    /**
    * Executes a shell command and returns the output.
    * @param {string} cmd - The command to execute.
    * @param {number} [timeout=5000] - The command execution timeout in milliseconds.
    * @returns {string} The command output.
    * @throws {Error} If the command fails.
    */
    execCommand(cmd, timeout = 5000) {
        try {
            return execSync(cmd, { timeout, stdio: ['pipe', 'pipe', 'pipe'] }).toString();
        } catch (error) {
            throw new Error(`Command failed: ${cmd}\n${error.message}`);
        }
    }

    /**
     * Checks if a character exists in the database.
     * @param {string} name - The name of the character.
     * @returns {Promise<boolean>} True if the character exists, false otherwise.
     */
    async checkCharacterInDB(name) {
        const SqlServer = require('../Util/SqlServer.js');
        const db = new SqlServer(process.env.DB_CONNECTION);
        const sqlStr = `SELECT ContainerId FROM cohdb.dbo.ents WHERE Name = ?`;

        let data = false;
        try {
            const result = await db.query(sqlStr, [name]);
            if (result) {
                data = true;
            }
        } catch (error) {
            global.appLogger.error('Error:', error);
        }
        return data;
    }

    /**
     * Sets the results array and parses the results.
     * @param {Array<string>} [res=[]] - The results to set.
     */
    setArray(res = []) {
        this.results = res;
        this.parseResults();
    }

    /**
     * Removes specific entries from the attributes.
     */
    blacklistEntries() {
        delete this.attributes['Ents2'][0]['AuthUserDataEx'];
        delete this.attributes['Ents2'][0]['AccSvrLock'];
    }

    /**
     * Parses the results and populates the attributes.
     */
    parseResults() {
        this.results.forEach(result => {
            if (result.includes('//')) {
                if (this.persistent) {
                    result = result.replace(/\/\/\s?/, '');
                } else {
                    return;
                }
            }

            result = result.trim();
            const [key, value] = result.split(/ (.+)/, 2);

            if (key && value) {
                const cleanValue = value.replace(/"/g, '');
                if (key.includes('[')) {
                    const [tableRow, field] = key.split('.');
                    const [table, row] = tableRow.split('[');
                    const rowIndex = parseInt(row, 10);
                    this.attributes[table] = this.attributes[table] || {};
                    this.attributes[table][rowIndex] = this.attributes[table][rowIndex] || {};
                    this.attributes[table][rowIndex][field] = cleanValue;
                } else {
                    this.attributes[key] = cleanValue;
                }
            }
        });
    }

    /**
     * Reconstructs the character data from attributes.
     */
    reconstruct() {
        this.constructed = [];
        for (const [table, attr] of Object.entries(this.attributes)) {
            if (typeof attr === 'object' && !Array.isArray(attr)) {
                // Handle objects
                this.processObjects(attr, table);
            } else if (Array.isArray(attr)) {
                // Handle arrays
                for (const [row, fields] of Object.entries(attr)) {
                    for (const [field, value] of Object.entries(fields)) {
                        // Directly use the value, assuming it's a primitive
                        this.constructed.push(`${table}[${row}].${field} "${value}"`);
                    }
                }
            } else {
                // Handle any other types if necessary
                this.constructed.push(`${table} "${attr}"`);
            }
        }
    }

    /**
    * Processes objects within the attributes for reconstruction.
    * @param {Object} attr - The attributes to process.
    * @param {string} table - The table name.
    */
    processObjects(attr, table) {
        for (const [key, value] of Object.entries(attr)) {
            // Serialize the value as a JSON string to handle complex objects
            this.constructed.push(`${table} "${JSON.stringify({ [key]: value })}"`);
        }
    }

    /**
    * Saves the character data to the database.
    */
    putCharacter() {
        this.reconstruct();
        const charfile = this.constructed.join('\n') + '\n';
        const tempFilePath = path.join(__dirname, '..', 'tempfile.tmp');

        fs.writeFileSync(tempFilePath, charfile);

        const cmd = `${process.env.DBQUERY} -putcharacter < ${tempFilePath} 2>&1`;
        this.execCommand(cmd, 10000);

        fs.unlinkSync(tempFilePath); // Clean up temp file
    }

    /**
     * Gets the character's alignment based on attributes.
     * @returns {string} The alignment of the character.
     */
    getAlignment() {
        const PlayerType = this.attributes['PlayerType'] || 0;
        const PlayerSubType = this.attributes['PlayerSubType'] || 0;
        const PlayerPraetorian = this.attributes['Ents2']?.[0]?.['PraetorianProgress'] || 0;

        if (PlayerPraetorian < 3 && PlayerPraetorian > 0) {
            return PlayerType === 0 ? 'Resistance' : 'Loyalist';
        }

        if (PlayerType === 0) {
            if (PlayerSubType === 0) return 'Hero';
            if (PlayerSubType === 1) return 'Paragon';
            return 'Vigilante';
        } else {
            if (PlayerSubType === 0) return 'Villain';
            if (PlayerSubType === 1) return 'Tyrant';
            return 'Rogue';
        }
    }

    /**
     * Converts the character attributes to a JSON string.
     * @returns {string} The JSON representation of the attributes.
     */
    toJSON() {
        return JSON.stringify(this.attributes, null, 2);
    }

    /**
     * Parses a JSON string and sets the character attributes.
     * @param {string} jsonString - The JSON string to parse.
     */
    parseJSON(jsonString) {
        this.attributes = JSON.parse(jsonString);
    }

    /**
     * Converts the reconstructed character data to an array.
     * @returns {Array<string>} The array representation of the character data.
     */
    toArray() {
        this.reconstruct();
        return this.constructed;
    }

    /**
     * Sets a specific attribute for the character.
     * @param {string} name - The name of the attribute.
     * @param {any} value - The value to set.
     */
    set(name, value) {
        this.attributes[name] = value;
    }

    /**
     * Gets the value of a specific attribute.
     * @param {string} name - The name of the attribute.
     * @returns {any} The value of the attribute.
     */
    get(name) {
        return this.attributes[name];
    }

    /**
     * Checks if the character has a specific attribute.
     * @param {string} name - The name of the attribute.
     * @returns {boolean} True if the attribute exists, false otherwise.
     */
    has(name) {
        return name in this.attributes;
    }

    /**
     * Deletes a specific attribute from the character.
     * @param {string} name - The name of the attribute to delete.
     */
    delete(name) {
        delete this.attributes[name];
    }
}

module.exports = Character;
