const CoHStats = require('../Model/CoHStats');
const GameAccount = require('../Model/gameAccount.js');
const Maps = require('../Model/maps');
const MenuController = require('./menuController.js');
const DataHandling = require('../Util/dataHandling.js');

/**
 * StaticController class for handling static pages.
 */
class StaticController {
    /**
     * Constructor for StaticController
     *
     * @param {*} container 
     */
    constructor(container) {
        this.container = container;
    }

    /**
     * Build the Home page
     *
     * @param {*} req The request object
     * @param {*} res The response object
     */
    async home(req, res) {
        const gameStats = new CoHStats();

        try {
            Maps.generate();
            const accounts = await gameStats.countAccounts();
            const characters = await gameStats.countCharacters();
            const status = await gameStats.getServerStatus();
            const menu = new MenuController(req.session.account?.username || null).menu;
            const online = await gameStats.getOnline();
            online.MapList = Maps.ID;

            const data = {
                title: process.env.portal_name,
                portal_url: global.httpUrl, // URL for the image
                menuTree: menu,
                portlLfgOnly: process.env.PORTAL_LFG_ONLY,
                online: online, // contains online.List.length and online.Count
                maplist: online.MapList,
                accounts: accounts,
                characters: characters,
                status: status,
                username: req.session.account?.username || null,
            };
            res.render('index', data);
        } catch (err) {
            // Handle error
            global.appLogger.error(`StaticController.home(): ${err}`);
            res.status(500).send('Internal Server Error');
        }
    }

    /**
     * Create an account page
     *
     * @param {*} req The request object
     * @param {*} res The response object
     */
    async create(req, res) {
        res.render('core/page-create-account');
    }

    /**
     * Manage account page
     * 
     * @param {*} req The request object
     * @param {*} res The response object
     */
    async manage(req, res) {
        if (!req?.session?.account) {
            req.session.nextPage = 'manage';
            return res.redirect('/login');
        }

        try {
            const account = new GameAccount();
            await account.fetchAccountByUsername(req.session.account.username);
            const playerObject = {
                username: account.username,
                characters: await account.getCharacterList(),
                lockedCharacters: await account.getLockedCharacters(),
                federation: global.federation,
                maplist: Maps.ID
            }
            res.render('core/page-manage', playerObject);
            global.appLogger.info(`StaticController.manage(): ${account.username} logged in`);
        } catch (err) {
            // Handle error
            global.appLogger.error(`StaticController.manage(): ${err}`);
            res.status(500).send('Internal Server Error');
        }
    }


    /**
     * Render a static page based on the provided page parameter.
     * @note Should be able to serve pages from the `core/` directory
     *
     * @param {*} req 
     * @param {*} res 
     */
    async page(req, res) {
        const page = req.params.page;

        try {
            res.render(`core/${DataHandling.basicSanitize(page)}`);
        } catch (err) {
            global.appLogger.error(`StaticController.page(): ${err}`);
            // Handle 404
            res.status(404).render('core/404');
        }
    }
}

module.exports = StaticController;
