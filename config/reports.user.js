// config/reports.user.js example

/**
 * How to create custom reports for yourself:
 * Edit this file by adding a new report object with a unique key (e.g., 'AuditAdmins8').
 * 
 * You can get started by copying the template at the end of this file.
 * 
 * Each report object should have the following properties:
 * - description (string): A brief description of the report.
 * - sql (string): The SQL query to execute for the report.
 * - transpose (boolean): Whether the report requires transposing the result set.
 * 
 * You can use the following placeholders in the SQL query:
 * - '@ACCOUNT_NAME' will be replaced with the account name.
 * - '@CHARACTER_NAME' will be replaced with the character name.
 * - '@ACCOUNT_UID' will be replaced with the account UID.
 * - '@CHARACTER_CID' will be replaced with the character CID.
 * 
 */
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