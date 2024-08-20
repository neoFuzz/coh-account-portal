const path = require('path');
const fs = require('fs');
const SqlServer = require('../Util/SqlServer');
const { getReportsConfig } = require('../Reports/reportsConfig');

class ReportsController {
    constructor(container) {
        this.container = container;
    }

    async listReports(req, res) {
        this.verifyLogin(req, res);

        const reportsConfig = getReportsConfig();

        res.render('core/page-reports', { reports: reportsConfig });
    }

    async report(req, res) {
        this.verifyLogin(req, res);

        const reportsConfig = getReportsConfig();
        const sql = SqlServer.getInstance();
        const reportName = req.params.name;
        const query = reportsConfig[reportName]?.sql || '';
        let params = [];
        let accounts = [];
        let characters = [];
        let results = [];

        if (query.includes('@ACCOUNT_NAME') || query.includes('@ACCOUNT_UID') || query.includes('@CHARACTER_NAME') || query.includes('@CHARACTER_CID')) {
            if (req.query.account && req.query.account !== 'null') {
                accounts = await this.fetchAccounts(sql);

                if (query.includes('@ACCOUNT_NAME')) {
                    const account = accounts.find(acc => acc.uid == req.query.account);
                    if (account) {
                        query = `DECLARE @ACCOUNT_NAME VARCHAR(MAXLEN) = ?;${query}`;
                        params.push(account.account_name);
                    }
                }

                if (query.includes('@ACCOUNT_UID')) {
                    query = `DECLARE @ACCOUNT_UID INT = ?;${query}`;
                    params.push(req.query.account);
                }
            }

            if (query.includes('@CHARACTER_NAME') || query.includes('@CHARACTER_CID')) {
                if (req.query.account && req.query.account !== 'null') {
                    characters = await this.fetchCharacters(sql, req.query.account);

                    if (req.query.character && req.query.character !== 'null') {
                        if (query.includes('@CHARACTER_NAME')) {
                            const character = characters.find(char => char.ContainerId == req.query.character);
                            if (character) {
                                query = `DECLARE @ACCOUNT_NAME VARCHAR(MAXLEN) = ?;${query}`;
                                params.push(character.Name);
                            }
                        }

                        if (query.includes('@CHARACTER_CID')) {
                            query = `DECLARE @CHARACTER_CID INT = ?;${query}`;
                            params.push(req.query.character);
                        }
                    }
                }
            }
        }

        if (!params.length) {
            results = await this.fetchResults(sql, query, params);
        }

        res.render('core/page-reports-display', {
            reports: reportsConfig,
            results: results,
            title: reportName,
            accounts: accounts,
            characters: characters,
            account: req.query.account || '',
            character: req.query.character || ''
        });
    }

    verifyLogin(req, res) {
        // Implement your login verification logic here
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
}

module.exports = ReportsController;
