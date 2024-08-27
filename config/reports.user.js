// config/reports.user.js example

// How to create custom reports for yourself:
// edit this file
// Replacement strings: '@ACCOUNT_NAME', '@CHARACTER_NAME', '@ACCOUNT_UID', '@CHARACTER_CID'

const reports = {
    'AuditAdmins8': {
        description: '[Custom] Super Administrative characters audit.',
        sql: `
            SELECT Ents.Name, Ents.AuthName, Ents.AccessLevel
            FROM cohdb.dbo.Ents
            WHERE Ents.AccessLevel > 8
            ORDER BY Ents.AuthName, Ents.Name
        `,
        transpose: false
    }

// add a comma (,) after the brace (}) then add report blob above this line
};

module.exports = reports;

/*
******** TEMPLATE ********

'AuditAdmins8': {
        description: '[Custom] Super Administrative characters audit.',
        sql: `
            SELECT Ents.Name, Ents.AuthName, Ents.AccessLevel
            FROM cohdb.dbo.Ents
            WHERE Ents.AccessLevel > 8
            ORDER BY Ents.AuthName, Ents.Name
        `,
        transpose: false // can be true and needed for some reports - like salvage.
    },
*/