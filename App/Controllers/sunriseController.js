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
            portalName: process.env.portal_name
        });
    }

    async uptime(req, res) {
        res.setHeader('Content-Type', 'text/xml');
        const zuluTime = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'); // Equivalent to '%Y-%m-%dT%H:%M:%SZ'

        let authServer = '';
        let gameServer = '';

        // TODO: Authserver check
        authServer += '<server type="auth>';
        authServer += '<available value="true" />';
        authServer += '</server>';

        try {
            const servers = await this.sql.fetchAssoc('SELECT name, inner_ip FROM cohauth.dbo.server');

            for (const row of servers) {
                gameServer += '<server type="game">';
                gameServer += `<name>${row.name}</name>`;

                const gameStats = new CoHStats();
                const status = await gameStats.getServerStatus();
                if (status.status === 'Online') {
                    gameServer += '<available value="true" />';
                } else {
                    gameServer += '<available value="false" />';
                }

                // Query for online players
                const online = this.sql.fetchNumeric('SELECT count(*) FROM cohdb.dbo.ents WHERE Active > 0');
                gameServer += `<players current="${online[0][0]}" />`;
                gameServer += '</server>';
            }
        } catch (err) {
            // Handle error
            res.status(500).send('Internal Server Error');
            return;
        }

        res.render('sunrise/uptime', {
            portalName: process.env.portal_name,
            zuluTime: zuluTime,
            authServer: authServer,
            gameServer: gameServer
        });
    }
}

module.exports = SunriseController;
