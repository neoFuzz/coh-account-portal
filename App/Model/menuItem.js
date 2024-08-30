/**
 * Represents a menu item with optional submenus and active states.
 */
class MenuItem {
    /**
     * Creates an instance of MenuItem.
     * 
     * @param {string} [text='#'] - The text to display for the menu item.
     * @param {string} [url='#'] - The URL associated with the menu item.
     * @param {boolean} [active=false] - Whether the menu item is active.
     */
    constructor(text = '#', url = '#', active = false) {
        this.text = text;
        this.url = url;
        this.active = active;
        this.activeTrail = false;
        this.submenu = [];
        this.parent = null;
    }

    /**
     * Adds a submenu to this menu item.
     * 
     * @param {MenuItem|MenuItem[]} submenu - A single MenuItem or an array of MenuItem instances to be added as a submenu.
     */
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

    /**
     * Sets the parent of this menu item.
     * 
     * @param {MenuItem|null} parent - The parent MenuItem instance or null if no parent.
     */
    setParent(parent) {
        this.parent = parent;
    }

    /**
     * Marks this menu item as active and optionally its ancestors.
     * 
     * @param {boolean} [activeTrail=false] - Whether to mark the active trail.
     */
    setActive(activeTrail = false) {
        this.active = true;
        this.activeTrail = activeTrail;
        if (this.parent) {
            this.parent.setActive(true);
        }
    }

    /**
     * Gets a serialized representation of the menu item.
     * 
     * @returns {Object} The serialized menu item.
     * @property {string} text - The text of the menu item.
     * @property {string} url - The URL of the menu item.
     * @property {boolean} active - Whether the menu item is active.
     * @property {boolean} 'active-trail' - Whether the menu item has an active trail.
     * @property {Object[]} submenu - The serialized submenu items.
     */
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
