const SqlServer = require('../Util/SqlServer');
const CoHStats = require('../Model/CoHStats');

class SunriseController {
    constructor(container) {
        this.container = container;
        this.sql = new SqlServer(process.env.DB_CONNECTION);
    }

    async manifest(req, res) {
        res.setHeader('Content-Type', 'text/xml');

        res.render('sunrise/manifest', {
            portalName: process.env.portal_name,
            servers: [],
            applications: [],
            runtimes: []
        });
    }

    async uptime(req, res) {
        res.setHeader('Content-Type', 'text/xml');
        const zuluTime = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'); // Equivalent to '%Y-%m-%dT%H:%M:%SZ'

        let xmlServers = [];

        // TODO: Authserver check
        xmlServers.push({ type: "auth", available: true });

        try {
            const servers = await this.sql.query('SELECT name, inner_ip FROM cohauth.dbo.server');

            for (const row of servers) {
                const gameStats = new CoHStats();
                const status = await gameStats.getServerStatus();

                // Query for online players
                const online = await this.sql.query('SELECT count(*) FROM cohdb.dbo.ents WHERE Active > 0');

                xmlServers.push({
                    type: "game",
                    name: row.name,
                    available: status.status === 'Online',
                    players: online[0]["Column0"]
                })
            }
        } catch (err) {
            // Handle error
            res.status(500).send('Internal Server Error');
            return;
        }

        res.render('sunrise/uptime', {
            portalName: process.env.portal_name,
            zuluTime: zuluTime,
            servers: xmlServers
        });
    }
}

module.exports = SunriseController;
