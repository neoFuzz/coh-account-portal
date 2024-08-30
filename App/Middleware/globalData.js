/**
 * Middleware function to populate global data for rendering.
 * 
 * This middleware performs the following actions:
 * 1. Initializes instances of `CoHStats` and `Maps`.
 * 2. Generates a list of maps.
 * 3. Fetches game statistics, including account count, character count, server status, and online status.
 * 4. Retrieves and sets the menu tree based on the current session's account.
 * 5. Populates `res.locals.globalData` with various pieces of information for use in rendering.
 * 
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function in the stack.
 * @throws {Error} Throws an error if fetching data or setting `res.locals.globalData` fails.
 * @returns {Promise<void>} Calls `next()` to pass control to the next middleware function.
 */

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
            portal_name: process.env.portal_name,
            portal_url: global.httpUrl,
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