// DBFlag.js
const BitField = require('./BitField.js');

class DBFlag extends BitField {
    static get constants() {
        return {
            DBFLAG_TELEPORT_XFER: 0,
            DBFLAG_UNTARGETABLE: 1,
            DBFLAG_INVINCIBLE: 2,
            DBFLAG_DOOR_XFER: 3,
            DBFLAG_MISSION_ENTER: 4,
            DBFLAG_MISSION_EXIT: 5,
            DBFLAG_INVISIBLE: 6,
            DBFLAG_INTRO_TELEPORT: 7,
            DBFLAG_MAPMOVE: 8,
            DBFLAG_CLEARATTRIBS: 9,
            DBFLAG_NOCOLL: 10,
            DBFLAG_BASE_ENTER: 11,
            DBFLAG_RENAMEABLE: 12,
            DBFLAG_BASE_EXIT: 13,
            DBFLAG_ALT_CONTACT: 14,
            DBFLAG_ARCHITECT_EXIT: 15,
            DBFLAG_PRAET_SG_JOIN: 16,
            DBFLAG_HALF_MAX_HEALTH: 17,
            DBFLAG_UNLOCK_HERO_EPICS: 18,
            DBFLAG_UNLOCK_VILLAIN_EPICS: 19
        };
    }
}

module.exports = DBFlag;
