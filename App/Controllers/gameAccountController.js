const GameAccount = require('../Model/gameAccount.js');

class GameAccountController {
    /**
     * Create a new account.
     * 
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @returns {Promise<void>} - A promise that resolves when the account is created
     */
    async create(req, res) {
        let log = global.appLogger;
        log.info(`Creating account: ${req.body.username} : on SessionID ${req.sessionID}`);
        try {
            const gameAccount = new GameAccount('');
            await gameAccount.create(req.body.username, req.body.password);
            req.session.account = gameAccount;

            log.info(`Account created: ${req.body.username}`);
            res.render('page-create-account-success', { username: req.body.username });
        } catch (error) {
            log.error(`Failed to create account: ${error.message}`);
            res.render('page-create-account-error', { message: error.message });
        }
    }

    // Log in an account
    async login(req, res) {
        if (req.session.account) {
            return res.redirect(req.session.nextpage || '/');
        }

        if (req.body.username && req.body.password) {
            try {
                const gameAccount = new GameAccount('');
                await gameAccount.login(req.body.username, req.body.password);

                req.session.account = gameAccount;

                return res.redirect(req.session.nextpage || '/');
            } catch (error) {
                res.render('page-login', {
                    title: 'Login Failure',
                    message: error.message
                });
            }
        } else {
            if (req.session.account) {
                return res.redirect(req.session.nextpage || '/');
            }

            res.render('page-login', { nextpage: 'login' });
        }
    }

    // Log out and destroy session
    logout(req, res) {
        req.session.destroy(err => {
            if (err) {
                global.appLogger.warn(`gameAccountController.logout: ${err.message}`);
                return res.status(500).send('Unable to log out');
            }
            res.redirect('/');
        });
    }

    // Change password
    async changePassword(req, res) {
        if (!req.session.account) {
            req.session.nextpage = 'manage';
            return res.redirect('login');
        }

        try {
            const ga = new GameAccount();
            await ga.fetchAccountByUsername(req.session.account.username);
            await ga.changePassword(req.body.password);
            global.appLogger.info(`gameAccountController.changePassword: Password changed for ${req.session.account.username}`);
            res.render('page-generic-message', {
                title: 'Success',
                message: `Successfully Changed Password<p>Go back to <a href="/manage">manage</a></p>`
            });
        } catch (error) {
            global.appLogger.error(`gameAccountController.changePassword: Failed to change password: ${error.message}`);
            res.render('page-generic-message', {
                title: 'Error',
                message: `${error.message}<p>Go back to <a href="/">home</a></p>`
            });
        }
    }
}

module.exports = GameAccountController;
