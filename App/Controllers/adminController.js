const sql = require('msnodesqlv8');
const GameAccount = require('../Model/gameAccount.js');
const DataTable = require('../Model/dataTable.js');

// Configure database connection
const dbConfig = process.env.DB_CONNECTION;

/**
 * Controller class for handling admin-related operations.
 * @class AdminController
 */
class AdminController {
    /**
     * Verifies if the user is logged in as an admin.
     * @static
     * @param {*} req The request object.
     * @param {*} res The response object.
     * @returns {boolean} Returns true if the user is logged in as an admin, false otherwise.
     */
    static async adminCheck(req, res) {
        try {
            await AdminController.verifyLogin(req);
        } catch (error) {
            res.render('page-generic-message',
                { title: "Admin access denied", message: error.message });
            return false;
        }
        return true;
    }

    /**
     * Renders the admin page.
     * @static
     * @param {*} req The request object.
     * @param {*} res The response object.
     * @returns {void}
     */
    static async adminPage(req, res) {
        if (!AdminController.adminCheck(req, res)) {
            return;
        }
        res.render('page-admin');
    }

    /**
     * Handles the request to list accounts as an administrator.
     * @static
     * @param {*} req The request object. 
     * @param {*} res The response object. 
     * @returns {void} Returns a JSON response containing the account list.
     */
    static async listAccount(req, res) {
        try {
            await AdminController.verifyLogin(req);
        } catch (error) {
            res.render('page-generic-message',
                { title: "Admin access denied", message: error.message });
            return;
        }

        const query = `
            SELECT
                user_account.uid as uid,
                user_account.account as account_name,
                CASE WHEN user_account.block_flag = 0 THEN 'No' ELSE 'Yes' END as banned,
                CONVERT(VARCHAR, user_account.block_end_date, 101) as ban_expiry,
                CONVERT(VARCHAR, user_account.last_login, 101) as last_login,
                user_account.last_ip as last_ip,
                char_stats.inf as inf,
                char_count.num as num_characters,
                CASE WHEN char_stats.Active > 0 THEN 'Yes' ELSE '-' END as active,
                char_stats.TimePlayed as online_time_this_session,
                char_stats.TotalTime as online_time_total,
                NULL as button
            FROM cohauth.dbo.user_account
            LEFT JOIN (
                SELECT AuthId, 
                       SUM(COALESCE(InfluencePoints, 0)) as inf, 
                       SUM(COALESCE(TotalTime, 0)) as TotalTime, 
                       SUM(COALESCE(Active, 0)) as Active, 
                       SUM(COALESCE(TimePlayed, 0)) as TimePlayed 
                FROM cohdb.dbo.Ents 
                GROUP BY AuthId
            ) char_stats ON user_account.uid = char_stats.AuthId
            LEFT JOIN (
                SELECT AuthId, 
                       COUNT(*) as num 
                FROM cohdb.dbo.Ents 
                GROUP BY AuthId
            ) char_count ON user_account.uid = char_count.AuthId
        `;

        // Create an instance of DataTable with the base query
        const dataTable = new DataTable(query, []);

        // Use DataTable to handle the request and get the response
        dataTable.getJSON(req, (err, result) => {
            if (err) {
                console.error('DataTable error:', err);
                res.status(500).send('An error occurred');
                return;
            }
            res.json(result);
        });
    }

    /**
     * Handles the request to view an account as an administrator.
     * 
     * This method is an Express route handler that performs the following tasks:
     * 1. Verifies the login status of the user by calling `AdminController.verifyLogin`.
     * 2. Fetches account details by `uid` from the `GameAccount` model.
     * 3. Renders a Pug template with the fetched account data.
     * 
     * @param {Object} req - The Express request object, which includes `params.uid` for the user ID.
     * @param {Object} res - The Express response object, used to render the view or send an error response.
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     * @throws {Error} Throws an error if the login verification fails or if fetching the account details encounters an issue.
     */
    static async adminAccount(req, res) {
        try {
            await AdminController.verifyLogin(req);

            const uid = req.params.uid;
            const account = new GameAccount()
            await account.fetchAccountByUid(uid);

            // Render the Pug template with account data
            res.render('core/page-admin-account', {
                username: account.username,
                uid: account.uid
            });
        } catch (error) {
            console.error('Error fetching account details:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    /**
     * Handles the request to list characters for a specific account as an administrator.
     * @static
     * @param {*} req The request object.
     * @param {*} res The response object.
     * @returns {void} Returns a JSON response containing the character list.
     */
    static async listCharacter(req, res) {
        AdminController.verifyLogin(req);
        const { uid } = req.params;

        const query = `
            SELECT
                ContainerId,
                Name,
                StaticMapId,
                Level,
                ExperiencePoints,
                InfluencePoints,
                CONVERT(VARCHAR, LastActive, 101) as LastActive,
                AccessLevel,
                NULL as button
            FROM cohdb.dbo.ents
            WHERE AuthId = ?
        `;

        // Create an instance of DataTable with the base query
        const dataTable = new DataTable(query, [uid]);

        // Use DataTable to handle the request and get the response
        dataTable.getJSON(req, (err, result) => {
            if (err) {
                console.error('DataTable error:', err);
                res.status(500).send('An error occurred');
                return;
            }
            res.json(result);
        });

    }

    /**
     * Handles the request to ban an account as an administrator.
     * @static 
     * @param {*} req The request object.
     * @param {*} res The response object.
     */
    static async banAccount(req, res) {
        try {
            await AdminController.verifyLogin(req);

            const uid = req.params.uid;
            const endDate = req.body.date || null;
            const account = new GameAccount()
            await account.fetchAccountByUid(uid);

            await account.banAccount(endDate);

            res.render('page-generic-message', {
                title: "Account Banned",
                message: `account was banned<br><a href="/admin/${uid}">Go Back</a>`
            });
        } catch (error) {
            global.appLogger.error('AdminController.banAccount(): ', error);
            res.render('page-generic-message', {
                title: "Error: Account ban problem",
                message: `account was not banned<br><a href="/admin/${uid}">Go Back</a>`
            });
        }
    }

    /**
     * Verifies if the user is logged in as an administrator.
     * @static
     * @param {*} req The request object.
     * @returns {Promise<void>} A promise that resolves when the verification is complete.
     * @throws {Error} Throws an error if the user is not logged in or if they are not an administrator.
     */
    static async verifyLogin(req) {
        if (!req.session.account) {
            throw new Error('You must be logged in to access this page.');
        }

        const ga = new GameAccount();
        await ga.fetchAccountByUsername(req.session.account.username);

        if (!ga.isAdmin()) {
            throw new Error('You must be an administrator to access this page.');
        }
    }
}

module.exports = AdminController;
