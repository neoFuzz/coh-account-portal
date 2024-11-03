const SqlServer = require('../Util/SqlServer');
const CoHStats = require('../Model/CoHStats');
const net = require('net');

/**
 * SunriseController class for handling Sunrise Launcher related requests, like manifest.xml.
 */
class SunriseController {
    /**
     * Constructor for SunriseController
     *
     * @param {*} container Not used 
     */
    constructor(container) {
        this.container = container;
        this.sql = new SqlServer(process.env.DB_CONNECTION);
    }

    /**
     * Returns the Sunrise Launcher manifest.xml
     *
     * @param {*} req - The request object
     * @param {*} res - The response object
     */
    async manifest(req, res) {
        res.setHeader('Content-Type', 'text/xml');

        res.render('sunrise/manifest', {
            portalName: process.env.portal_name,
            servers: [],
            applications: [],
            runtimes: []
        });
    }

    /**
     * Returns the Sunrise Launcher uptime.xml
     *
     * @param {*} req - The request object
     * @param {*} res - The response object
     */
    async uptime(req, res) {
        res.setHeader('Content-Type', 'text/xml');
        const zuluTime = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'); // Equivalent to '%Y-%m-%dT%H:%M:%SZ'

        let xmlServers = [];

        // Authserver check
        const isActive = await this.checkPort(process.env.AUTH_SERVER, 2106);
        xmlServers.push({ type: "auth", available: isActive });

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

    /**
     * Checks if a port is active on a given host.
     * @param {string} host - The host to check
     * @param {number} port - The port to check
     * @returns {Promise<boolean>} - A promise that resolves to true if the port is active, false otherwise.
     */
    async checkPort(host, port) {
        return new Promise((resolve) => {
            const client = new net.Socket();

            client.setTimeout(3000); // Timeout after 3 seconds

            client.on('connect', () => {
                client.destroy(); // Close the connection
                resolve(true);   // Port is active
            });

            client.on('error', () => {
                resolve(false);  // Port is not active
            });

            client.on('timeout', () => {
                client.destroy();
                resolve(false);  // Port is not active
            });

            client.connect(port, host);
        });
    }
}

module.exports = SunriseController;
