class MenuItem {
    constructor(text = '#', url = '#', active = false) {
        this.text = text;
        this.url = url;
        this.active = active;
        this.activeTrail = false;
        this.submenu = [];
        this.parent = null;
    }

    add(submenu) {
        if (Array.isArray(submenu)) {
            submenu.forEach(menu => {
                menu.setParent(this);
            });
        } else {
            submenu.setParent(this);
        }

        this.submenu.push(submenu);
    }

    setParent(parent) {
        this.parent = parent;
    }

    setActive(activeTrail = false) {
        this.active = true;
        this.activeTrail = activeTrail;
        if (this.parent) {
            this.parent.setActive(true);
        }
    }

    getMenu() {
        return {
            text: this.text,
            url: this.url,
            active: this.active,
            'active-trail': this.activeTrail,
            submenu: this.submenu.map(item => item.getMenu()), // Ensuring submenu items are serialized
        };
    }
}

// Export the MenuItem class
module.exports = MenuItem;
