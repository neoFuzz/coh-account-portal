// reportsConfig.js

const reports = {
    'CharacterSalvage': {
        description: 'Display all salvage a character possesses in their inventory and storage; does not include auction house or game mails.',
        sql: `
            SELECT 'Inventory' as Type, *
            FROM cohdb.dbo.InvSalvage0 WHERE ContainerId = @CHARACTER_CID
            UNION
            SELECT 'Stored' AS Type, *,
                NULL AS S_ExperiementalTech,
                NULL AS S_UnknownChemicals,
                NULL AS S_SignatureSalvage,
                NULL AS S_SignatureSalvageU,
                NULL AS S_Never_MeltingIce
            FROM cohdb.dbo.InvStoredSalvage0 WHERE ContainerId = @CHARACTER_CID
        `,
        transpose: true // We definitely want this report rotated.
    },

    'Merits': {
        description: 'Display end game merits held by accounts.',
        sql: `
            SELECT Ents.AuthName, Ents.Name,
                InvSalvage0.S_EndgameMerit01 + InvStoredSalvage0.S_EndgameMerit01 AS EndgameMerit01,
                InvSalvage0.S_EndgameMerit02 + InvStoredSalvage0.S_EndgameMerit02 AS EndgameMerit02,
                InvSalvage0.S_EndgameMerit03 + InvStoredSalvage0.S_EndgameMerit03 AS EndgameMerit03,
                InvSalvage0.S_EndgameMerit04 + InvStoredSalvage0.S_EndgameMerit04 AS EndgameMerit04,
                InvSalvage0.S_EndgameMerit05 + InvStoredSalvage0.S_EndgameMerit05 AS EndgameMerit05
            FROM cohdb.dbo.Ents
            LEFT JOIN cohdb.dbo.InvSalvage0 ON Ents.ContainerId = InvSalvage0.ContainerId
            LEFT JOIN cohdb.dbo.InvStoredSalvage0 ON Ents.ContainerId = InvStoredSalvage0.ContainerId
            WHERE
                InvSalvage0.S_EndgameMerit01 IS NOT NULL OR
                InvSalvage0.S_EndgameMerit02 IS NOT NULL OR
                InvSalvage0.S_EndgameMerit03 IS NOT NULL OR
                InvSalvage0.S_EndgameMerit04 IS NOT NULL OR
                InvSalvage0.S_EndgameMerit05 IS NOT NULL OR
                InvStoredSalvage0.S_EndgameMerit01 IS NOT NULL OR
                InvStoredSalvage0.S_EndgameMerit02 IS NOT NULL OR
                InvStoredSalvage0.S_EndgameMerit03 IS NOT NULL OR
                InvStoredSalvage0.S_EndgameMerit04 IS NOT NULL OR
                InvStoredSalvage0.S_EndgameMerit05 IS NOT NULL
            ORDER BY AuthName, Name
        `
    },

    'RichestCharacters': {
        description: 'Top 10 richest characters in the game.',
        sql: `
            SELECT TOP 10
                Ents.ContainerId,
                Ents.Name,
                Ents.StaticMapId,
                Ents.Level,
                Ents.ExperiencePoints,
                Ents.InfluencePoints,
                convert(varchar, ents.LastActive, 101) as LastActive,
                ents.AccessLevel,
                null as button
            FROM cohdb.dbo.ents
            ORDER BY Ents.InfluencePoints Desc
        `
    },

    'AuditAdmins': {
        description: 'Administrative characters audit.',
        sql: `
            SELECT Ents.Name, Ents.AuthName, Ents.AccessLevel
            FROM cohdb.dbo.Ents
            WHERE Ents.AccessLevel > 0
            ORDER BY Ents.AuthName, Ents.Name
        `
    }
};

function getReportsConfig() {
    return reports;
}

module.exports = { reports, getReportsConfig };
