const CoHStats = require('../Model/CoHStats.js');
const MenuItem = require('../Model/MenuItem.js');
const Maps = require('../Model/maps.js');

/**
 * MenuControler class for managing the menu items and generating the menu data.
 */
class MenuController {
    /**
     * Constructor for MenuController.
     * @param {string} username 
     */
    constructor(username) {
        this.menu = [];
        this.account = username;

        this.menu.push(new MenuItem('Home', global.httpUrl));

        if (!this.isAccountSet()) {
            this.menu.push(new MenuItem('Create Account', `${global.httpUrl}create`));
        }

        this.menu.push(new MenuItem('My Account', `${global.httpUrl}manage`));

        if (this.isAccountSet() && this.isAdmin()) {
            this.menu.push(new MenuItem('Admin', `${global.httpUrl}admin/`));
            this.menu.push(new MenuItem('Reports', `${global.httpUrl}admin/reports`));
            let reportsList = new MenuItem('Reports List');

            // submenus need more work
            // sample code: reportsList.add(new MenuItem('RichestCharacters Report', `${global.httpUrl}admin/reports/RichestCharacters`));

            const ReportsController = require('./reportsController.js');
            let reportsc = new ReportsController();
            const reports = Object.keys(reportsc.buildReports());
            reports.forEach(report => reportsList.add(
                new MenuItem(`${report} Report`, `${global.httpUrl}admin/reports/${report}`)
            ));

            this.menu.push(reportsList);
        }

        if (this.isAccountSet()) {
            this.menu.push(new MenuItem('Logout', `${global.httpUrl}logout`));
        }
    }

    /**
     * Checks if an account is set.
     * @returns {boolean} True if an account is set, false otherwise.
     */
    isAccountSet() {
        return !!this.account;
    }

    /**
     * Checks if the current account is an admin.
     * @returns {Promise<boolean>} True if the account is an admin, false otherwise.
     * @async
     */
    async isAdmin() {
        // Setup the AdminController and use a dummy request
        const AdminController = require('./adminController');
        const req = { session: { account: { username: this.account } } };
        return await AdminController.verifyLogin(req);
    }

    /**
     * Gets the menu data.
     * @returns {Object} The menu data.
     * @async
     * @param {*} callback The callback function to call with the menu data.
     */
    getMenu(callback) {
        const gameStats = new CoHStats();
        const result = this.menu.map(item => item.getMenu());

        let onlineList = gameStats.getOnline();

        Maps.generate();

        const data = {
            portal_name: process.env.portal_name,
            portal_url: global.httpUrl,
            portal_style: process.env.portal_style,
            menu_tree: result,
            online: onlineList,
            portal_lfg_only: process.env.PORTAL_LFG_ONLY,
            maplist: Maps.ID
        };

        callback(null, data);

    }
}

module.exports = MenuController;
