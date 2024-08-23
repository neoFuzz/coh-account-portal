
module.exports = async (req, res, next) => {
    const CoHStats = require('../Model/CoHStats');
    const Maps = require('../Model/maps');
    const MenuController = require('../controllers/menuController.js');

    try {
        const gameStats = new CoHStats();
        Maps.generate();
        const accounts = await gameStats.countAccounts();
        const characters = await gameStats.countCharacters();
        const status = await gameStats.getServerStatus();
        const menu = new MenuController(req.session.account?.username || null).menu;
        const online = await gameStats.getOnline();
        online.MapList = Maps.ID;

        res.locals.globalData = {
            title: process.env.portal_name,
            portal_url: process.env.PORTAL_URL,
            portal_style: process.env.PORTAL_STYLE,
            portalLfgOnly: process.env.PORTAL_LFG_ONLY,
            username: req.session.account?.username || null,
            menuTree: menu,
            online: online, // online.List.length and online.Count
            maplist: online.MapList,
            accounts: accounts,
            characters: characters,
            status: status,

        };
    } catch (err) {
        // Handle error
        global.appLogger.error(`StaticController.home(): ${err}`);
        res.status(500).send('Internal Server Error');
    }
    next();
};