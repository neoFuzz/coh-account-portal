const CoHStats = require('../Model/CoHStats');
const MenuController = require('./menuController');
const Maps = require('../Model/maps');

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
                status: status
            };

            res.render('index', data);
        } catch (err) {
            // Handle error
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
            const account = req.session.account;
            res.render('core/page-manage', {
                username: account.username,
                characters: account.getCharacterList(),
                lockedCharacters: account.getLockedCharacters(),
                federation: global.federation // Ensure this is set somewhere in your app
            });
        } catch (err) {
            // Handle error
            res.status(500).send('Internal Server Error');
        }
    }

    async page(req, res) {
        const page = req.params.page;

        try {
            res.render(`core/${page}`);
        } catch (err) {
            // Handle 404
            res.status(404).render('core/404'); // Ensure you have a 404 template
        }
    }
}

module.exports = StaticController;
