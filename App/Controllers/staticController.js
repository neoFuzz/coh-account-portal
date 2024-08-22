const CoHStats = require('../Model/CoHStats');
const GameAccount = require('../Model/gameAccount.js');
const Maps = require('../Model/maps');
const MenuController = require('./menuController.js');

class StaticController {
    constructor(container) {
        this.container = container;
    }

    async home(req, res) {
        const gameStats = new CoHStats();

        try {
            Maps.generate();
            const accounts = await gameStats.countAccounts();
            const characters = await gameStats.countCharacters();
            const status = await gameStats.getServerStatus();
            const menu = new MenuController().menu;
            const online = await gameStats.getOnline();
            online.MapList = Maps.ID;

            const data = {
                title: process.env.portal_name,
                portal_url: process.env.PORTAL_URL, // URL for the image
                menuTree: menu,
                portlLfgOnly: process.env.PORTAL_LFG_ONLY,
                online: online, // online.List.length and online.Count
                content2: 'Additional content goes here.', // Content to be rendered in the `content2` block
                maplist: online.MapList,
                accounts: accounts,
                characters: characters,
                status: status,
                username: req.session.account?.username || null,
            };
            // maybe extra logging here, unsure? //global.appLogger.info(`StaticController.home(): ${JSON.stringify(data.status)}`);
            res.render('index', data);
        } catch (err) {
            // Handle error
            global.appLogger.error(`StaticController.home(): ${err}`);
            res.status(500).send('Internal Server Error');
        }
    }

    async create(req, res) {
        res.render('core/page-create-account');
    }

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

    async page(req, res) {
        const page = req.params.page;

        try {
            res.render(`core/${page}`);
        } catch (err) {
            global.appLogger.error(`StaticController.page(): ${err}`);
            // Handle 404
            res.status(404).render('core/404'); // Ensure you have a 404 template
        }
    }
}

module.exports = StaticController;
