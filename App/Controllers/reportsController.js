const path = require('path');
const fs = require('fs');
const sql = require('msnodesqlv8');

/**
 * Reports Controller
 * 
 * @class ReportsController
 */
class ReportsController {
    /**
     * Creates an instance of ReportsController.
     *
     * @param {*} container 
     */
    constructor(container) {
        this.container = container;
        this.reports = [];
    }

    /**
     * Get a list of the reports available.
     *
     * @param {*} req - The request object
     * @param {*} res - The response object
     */
    async listReports(req, res) {
        let b = await this.verifyLogin(req);
        if (!b) {
            res.redirect('/login');
        }

        try {
            const reports = this.buildReports();

            res.render('core/page-reports', { reports });
        } catch (error) {
            console.error('Error listing reports:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    /**
     * Build reports from files and user-specific file.
     *
     * @returns {Object} reports - The reports object
     */
    buildReports() {
        // Include the reports.default.js file
        let reports = require('../Reports/reports.default.js');

        // Include user-specific reports if available
        const userFile = path.join(__dirname, '../../config/reports.user.js');
        if (fs.existsSync(userFile)) {
            Object.assign(reports, require(userFile));
        }
        if (this.reports.length === 0) {
            this.reports = reports;
        }
        return reports;
    }

    /**
     * Output the requested report.
     *
     * @param {*} req - The request object
     * @param {*} res - The response object
     */
    async report(req, res) {
        let b = await this.verifyLogin(req);
        if (!b) {
            res.redirect('/login');
        }

        let reports = this.buildReports();

        const character = req.query.character || null;
        const account = req.query.account || null;
        const name = req.params.name;
        let query = reports[name]?.sql || 'SELECT * FROM your_table';
        const params = [];
        let needsAccountDefined = false;
        let needsCharacterDefined = false;
        let accounts = [];
        let characters = [];
        let results = [];

        try {
            // Check and prepare query for account placeholders
            if (/@ACCOUNT_NAME|@ACCOUNT_UID|@CHARACTER_NAME|@CHARACTER_CID/.test(query)) {
                accounts = await this.queryDatabase(
                    `SELECT user_account.uid as uid, user_account.account as account_name
                     FROM cohauth.dbo.user_account ORDER BY account`);
                if (account && account !== 'null') {
                    if (/@ACCOUNT_NAME/.test(query)) {
                        const accountName = accounts.find(row => row.uid === account);
                        if (accountName) {
                            query = `DECLARE @ACCOUNT_NAME VARCHAR(MAXLEN) = ?;${query}`;
                            params.push(accountName.account);
                        }
                    }
                    if (/@ACCOUNT_UID/.test(query)) {
                        query = `DECLARE @ACCOUNT_UID INT = ?;${query}`;
                        params.push(account);
                    }
                } else {
                    needsAccountDefined = true;
                }
            }

            // Check and prepare query for character placeholders
            if (/@CHARACTER_NAME|@CHARACTER_CID/.test(query)) {
                if (account && account !== 'null') {
                    characters = await this.queryDatabase(`
                        SELECT ContainerId, Name
                        FROM cohdb.dbo.Ents
                        WHERE AuthId = ? ORDER BY Name`, [account]);
                    if (character && character !== 'null') {
                        if (/@CHARACTER_NAME/.test(query)) {
                            const characterName = characters.find(row => row.ContainerId === character);
                            if (characterName) {
                                query = `DECLARE @CHARACTER_NAME VARCHAR(MAXLEN) = ?;${query}`;
                                params.push(characterName.Name);
                            }
                        }
                        if (/@CHARACTER_CID/.test(query)) {
                            query = `DECLARE @CHARACTER_CID INT = ?;${query}`;
                            params.push(character);
                        }
                    } else {
                        needsCharacterDefined = true;
                    }
                } else {
                    needsCharacterDefined = true;
                }
            }

            // Execute the query if no placeholders are missing
            if (!needsAccountDefined && !needsCharacterDefined) {
                results = await this.queryDatabase(query, params);
                if (reports[name]?.transpose) {
                    results = this.transpose(results);
                }
            }

            // Render the Pug template
            res.render('core/page-reports-display', {
                reports,
                results,
                title: name,
                accounts,
                characters,
                account: account || '',
                character: character || ''
            });
        } catch (err) {
            res.status(500).send("Error in report module");
            global.appLogger.error("ReportsController.reports(): ", err.message);
        }

    }

    /**
     * Verify if the user is logged in.
     * @param {*} req - The request object
     * @returns {boolean} - True if the user is logged in, false otherwise
     */
    async verifyLogin(req) {
        // Setup the AdminController and use a dummy request
        const AdminController = require('./adminController.js');
        try {
            await AdminController.verifyLogin(req);
        } catch (error) {
            return false;
        }
        return true;
    }

    /**
     * Fetch accounts from the database
     * @async
     * @param {string} sql 
     * @returns {Promise<Array>} - An array of account objects 
     */
    async fetchAccounts(sql) {
        return new Promise((resolve, reject) => {
            sql.fetchNumeric(
                `SELECT user_account.uid as uid, user_account.account as account_name
                 FROM cohauth.dbo.user_account ORDER BY account`, [],
                (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                });
        });
    }

    /**
     * Fetch characters from the database
     * @async
     * @param {string} sql - The SQL connection string
     * @param {number} accountId - The account ID
     * @returns 
     */
    async fetchCharacters(sql, accountId) {
        return new Promise((resolve, reject) => {
            sql.fetchNumeric(`
                SELECT Ents.ContainerId, Ents.Name
                FROM cohdb.dbo.Ents
                WHERE AuthId = ? ORDER BY Name`,
                [accountId], (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                });
        });
    }

    /**
     * Fetch results from the database
     * @async
     * @param {string} sql - The SQL connection string 
     * @param {string} query - The SQL query
     * @param {Array[]} params - The query parameters
     * @returns 
     */
    async fetchResults(sql, query, params) {
        return new Promise((resolve, reject) => {
            sql.fetchAssoc(query, params, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    /**
     * Helper function to transpose results
     * @param {Array} assocArray - The associative array to transpose
     * @returns {Array} - The transposed array
     */
    transpose(assocArray) {
        if (assocArray.length === 0) return [];

        const keys = Object.keys(assocArray[0]);
        const transposed = [];

        // Set up the first column
        for (let col = 1; col < keys.length; col++) {
            transposed[col - 1] = { [keys[0]]: keys[col] };
        }

        // Do additional columns
        for (let col = 1; col < keys.length; col++) {
            for (const element of assocArray) {
                transposed[col - 1][element[keys[0]]] = element[keys[col]];
            }
        }

        return transposed;
    }

    /**
     * Helper function to query the database
     * @async
     * @param {string} query - The SQL query
     * @param {Array[]} params - The query parameters
     * @returns {Promise<Array>} - The query results
     */
    async queryDatabase(query, params = []) {
        return new Promise((resolve, reject) => {
            sql.query(process.env.DB_CONNECTION, query, params, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}

module.exports = ReportsController;
