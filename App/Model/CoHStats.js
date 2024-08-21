const sql = require('../Util/SqlServer.js');
const { execSync } = require('child_process');
const axios = require('axios');
const SqlServer = require('../Util/SqlServer.js');

function formatTime(t, f = ':') {
  const hours = Math.floor(t / 3600);
  const minutes = Math.floor((t % 3600) / 60);
  const seconds = t % 60;
  return `${String(hours).padStart(2, '0')}${f}${String(minutes).padStart(2, '0')}${f}${String(seconds).padStart(2, '0')}`;
}

class CoHStats {
  constructor() {
    this.pool = new SqlServer(process.env.DB_CONNECTION);
  }

  async countAccounts() {
    try {
      const rows = await this.pool.query('SELECT count(*) as count FROM cohauth.dbo.user_account');
      return rows[0].count;
    } catch (error) {
      console.error('Error counting accounts:', error);
      return -1;
    }
  }

  async countCharacters() {
    try {
      const rows = await this.pool.query('SELECT count(*) as count FROM cohdb.dbo.ents');
      return rows[0].count;
    } catch (error) {
      console.error('Error counting characters:', error);
      return -1;
    }
  }

  async getOnline() {
    try {
      const rows = await this.pool.query(
        `SELECT Ents.Name, Ents.StaticMapId, Ents.AccessLevel, Ents2.LfgFlags
        FROM cohdb.dbo.Ents
        INNER JOIN cohdb.dbo.Ents2 ON Ents.ContainerId = Ents2.ContainerId
        WHERE Ents.Active > 0
        ORDER BY Name ASC`
      );

      const onlineCount = rows.filter(row => {
        if (row.AccessLevel >= process.env.PORTAL_HIDE_CSR) return false;
        return !(process.env.PORTAL_LFG_ONLY === 'true' && (!row.LfgFlags || row.LfgFlags === 0 || row.LfgFlags === 128));
      }).length;

      const mapName = {}; // You need to implement map name mapping
      const onlineList = rows
        .filter(row => row.AccessLevel < process.env.PORTAL_HIDE_CSR &&
          (process.env.PORTAL_LFG_ONLY !== 'true' || row.LfgFlags && row.LfgFlags !== 0 && row.LfgFlags !== 128))
        .map(row => ({
          ...row,
          MapName: mapName[row.StaticMapId] // Replace with actual map name mapping logic
        }));

      return { Count: onlineCount, List: onlineList };
    } catch (error) {
      console.error('Error getting online players:', error);
      return { Count: 0, List: [] };
    }
  }

  async getServerStatus() {
    if (process.env.SERVERAPI && process.env.SHARDNAME) {
      try {
        const { data } = await axios.get(`${process.env.SERVERAPI}${process.env.SHARDNAME}/allstats`);
        const stats = data[process.env.SHARDNAME];
        if (stats.status === 'up') {
          return {
            status: 'Online',
            started: stats.launchers[0].OnSince,
            uptime: formatTime(Date.now() / 1000 - new Date(stats.launchers[0].OnSince).getTime() / 1000)
          };
        } else {
          return { status: 'Offline' };
        }
      } catch (error) {
        console.error('Error fetching server status from API:', error);
        return { status: 'Offline' };
      }
    } else if (process.env.DBQUERY) {
      try {
        const cmd = `${process.env.DBQUERY} -dbquery`;
        global.appLogger.info("Running command: " + cmd);
        const results = execSync(cmd, { timeout: 5000, stdio: ['pipe', 'pipe', 'ignore'] }).toString();
        if (results.length > 0) {
          const uptime = results.split('\n')[10].split(',');
          return {
            status: 'Online',
            uptime: uptime[1].trim() + ' ' + uptime[2].trim(),
            started: uptime[0].trim().substring(20)
          };
        } else {
          global.appLogger.info("server offline");
          return { status: 'Offline' };
        }
      } catch (error) {
        console.error('Error executing DB query command:', error);
        return { status: 'broken - ' + error.message };
      }
    }

    return { status: 'Offline' };
  }
}

module.exports = CoHStats;
