const CoHStats = require('../Model/CoHStats.js');
const MenuItem = require('../Model/MenuItem.js');
const Maps = require('../Model/maps.js'); // Ensure this file exists with the required structure

class MenuController {
    constructor(username) {
        this.menu = [];
        this.account = username;

        this.menu.push(new MenuItem('Home', process.env.PORTAL_URL));

        if (!this.isAccountSet()) {
            this.menu.push(new MenuItem('Create Account', `${process.env.PORTAL_URL}create`));
        }

        this.menu.push(new MenuItem('My Account', `${process.env.PORTAL_URL}manage`));

        if (this.isAccountSet() && this.isAdmin()) {
            this.menu.push(new MenuItem('Admin', `${process.env.PORTAL_URL}admin/`));
            this.menu.push(new MenuItem('Reports', `${process.env.PORTAL_URL}admin/reports`));
        }

        if (this.isAccountSet()) {
            this.menu.push(new MenuItem('Logout', `${process.env.PORTAL_URL}logout`));
        }
    }

    isAccountSet() {
        return !!this.account;
    }

    async isAdmin() {
        // Setup the AdminController and use a dummy request
        const AdminController = require('./adminController');
        const req = {session: {account: {username: this.account}}};
        return await AdminController.verifyLogin(req);
    }

    getMenu(callback) {
        const gameStats = new CoHStats();
        const result = this.menu.map(item => item.getMenu());

        gameStats.getOnline((err, onlineList) => {
            if (err) {
                onlineList = [];
            }
            Maps.generate();

            const data = {
                portal_name: process.env.portal_name,
                portal_url: process.env.PORTAL_URL,
                portal_style: process.env.portal_style,
                menu_tree: result,
                online: onlineList,
                portal_lfg_only: process.env.portal_lfg_only,
                maplist: Maps.ID
            };

            callback(null, data);
        });
    }
}

module.exports = MenuController;
