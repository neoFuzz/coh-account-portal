const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class Character {
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

    escapeShellArg(arg) {
        return arg.replace(/'/g, "'\\''"); // Escape single quotes
    }

    execCommand(cmd, timeout = 5000) {
        try {
            return execSync(cmd, { timeout, stdio: ['pipe', 'pipe', 'pipe'] }).toString();
        } catch (error) {
            throw new Error(`Command failed: ${cmd}\n${error.message}`);
        }
    }

    async checkCharacterInDB(name) {
        const SqlServer = require('../Util/SqlServer.js');
        const db = new SqlServer(process.env.DB_CONNECTION);
        const sqlStr = `SELECT ContainerId FROM cohdb.dbo.ents WHERE Name = '${name}'`;

        let data = false;
        try {
            const result = await db.query(sqlStr);
            if (result) {
                data = true;
            }
        } catch (error) {
            global.appLogger.error('Error:', error);
        }
        return data;
    }

    setArray(res = []) {
        this.results = res;
        this.parseResults();
    }

    blacklistEntries() {
        delete this.attributes['Ents2'][0]['AuthUserDataEx'];
        delete this.attributes['Ents2'][0]['AccSvrLock'];
    }

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
            const [key, value] = result.split(' ', 2);

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

    reconstruct() {
        this.constructed = [];
        for (const [table, attr] of Object.entries(this.attributes)) {
            if (!Array.isArray(attr)) {
                this.constructed.push(`${table} "${attr}"`);
            } else {
                for (const [row, fields] of Object.entries(attr)) {
                    for (const [field, value] of Object.entries(fields)) {
                        this.constructed.push(`${table}[${row}].${field} "${value}"`);
                    }
                }
            }
        }
    }

    putCharacter() {
        this.reconstruct();
        const charfile = this.constructed.join('\n') + '\n';
        const tempFilePath = path.join(__dirname, '..', 'tempfile.tmp');

        fs.writeFileSync(tempFilePath, charfile);

        const cmd = `${process.env.DBQUERY} -putcharacter < ${tempFilePath} 2>&1`;
        this.execCommand(cmd, 10000);

        fs.unlinkSync(tempFilePath); // Clean up temp file
    }

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

    toJSON() {
        return JSON.stringify(this.attributes, null, 2);
    }

    parseJSON(jsonString) {
        this.attributes = JSON.parse(jsonString);
    }

    toArray() {
        this.reconstruct();
        return this.constructed;
    }

    set(name, value) {
        this.attributes[name] = value;
    }

    get(name) {
        return this.attributes[name];
    }

    has(name) {
        return name in this.attributes;
    }

    delete(name) {
        delete this.attributes[name];
    }
}

module.exports = Character;
