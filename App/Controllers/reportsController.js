const path = require('path');
const fs = require('fs');
const sql = require('msnodesqlv8');

class ReportsController {
    constructor(container) {
        this.container = container;
    }

    async listReports(req, res) {
        if (!this.verifyLogin(req)) {
            res.redirect('/login');
        }

        try {
            // Include the reports.default.js file
            let reports = require('../../config/reports.default.js');

            // Include user-specific reports if available
            const userFile = path.join(__dirname, 'config/reports.user.js');
            if (fs.existsSync(userFile)) {
                Object.assign(reports, require(userFile));
            }

            res.render('core/page-reports', { reports });
        } catch (error) {
            console.error('Error listing reports:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async report(req, res) {
        if (!this.verifyLogin(req)) {
            res.redirect('/login');
        }

        try {
            const reportName = req.params.name;
            let query = '';
            let params = [];
            let results = [];
            let accounts = [];
            let characters = [];

            // Include the reports.default.js file
            let reports = require('../../config/reports.default.js');

            // Include user-specific reports if available
            const userFile = path.join(__dirname, 'config/reports.user.js');
            if (fs.existsSync(userFile)) {
                Object.assign(reports, require(userFile));
            }

            // Retrieve the SQL query for the report
            query = reports[reportName]?.sql || '';

            // Check for account and character parameters
            const accountId = req.query.account || '';
            const characterId = req.query.character || '';

            if (query.includes('@ACCOUNT_NAME') || query.includes('@ACCOUNT_UID')) {
                if (accountId) {
                    if (query.includes('@ACCOUNT_NAME')) {
                        const accountsResult = await this.queryDatabase('SELECT uid, account FROM user_account ORDER BY account');
                        accounts = accountsResult;

                        params.push(accounts.find(acc => acc.uid === accountId)?.account || '');
                    }

                    if (query.includes('@ACCOUNT_UID')) {
                        params.push(accountId);
                    }
                }
            }

            if (query.includes('@CHARACTER_NAME') || query.includes('@CHARACTER_CID')) {
                if (accountId) {
                    if (query.includes('@CHARACTER_NAME')) {
                        const charactersResult = await this.queryDatabase('SELECT ContainerId, Name FROM Ents WHERE AuthId = ? ORDER BY Name', [accountId]);
                        characters = charactersResult;

                        params.push(characters.find(char => char.ContainerId === characterId)?.Name || '');
                    }

                    if (query.includes('@CHARACTER_CID')) {
                        params.push(characterId);
                    }
                }
            }

            if (!params.length) {
                results = await this.queryDatabase(query, params);
                if (reports[reportName]?.transpose) {
                    results = transpose(results);
                }
            }

            res.render('core/page-reports-display', {
                reports,
                results,
                title: reportName,
                accounts,
                characters,
                account: accountId,
                character: characterId
            });
        } catch (error) {
            console.error('Error fetching report:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async verifyLogin(req) {
        // Setup the AdminController and use a dummy request
        const AdminController = require('./adminController.js');

        return await AdminController.verifyLogin(req);
    }

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

    async fetchCharacters(sql, accountId) {
        return new Promise((resolve, reject) => {
            sql.fetchNumeric('SELECT Ents.ContainerId, Ents.Name FROM cohdb.dbo.Ents WHERE AuthId = ? ORDER BY Name',
                [accountId], (err, rows) => {
                    if (err) return reject(err);
                    resolve(rows);
                });
        });
    }

    async fetchResults(sql, query, params) {
        return new Promise((resolve, reject) => {
            sql.fetchAssoc(query, params, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    /** Helper function to transpose results */
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

    // Helper function to query the database
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
