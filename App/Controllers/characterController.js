const DataHandling = require('../Util/dataHandling.js');
const Vars = require('../Util/Vars');
const axios = require('axios');
const https = require('https');

/** Create an HTTPS agent that ignores self-signed certificate errors */
const agent = new https.Agent({ rejectUnauthorized: false });

/**
 * @class CharacterController
 * @description This class contains methods for handling character-related operations.
 * @note under development
 */
class CharacterController {
  /**
   * This looks like it is meant to accept encrypted JSON from a source and display it.
   * Possible test for server federation.
   * 
   * @note This is something under development
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  static async dev(req, res) {
    try {
      const { q } = req.query;
      const portalKey = process.env.PORTAL_KEY;
      const portalIv = process.env.PORTAL_IV;

      if (!q || !portalKey || !portalIv) {
        return res.status(400).send('Missing required parameters');
      }
      let url = `${global.httpUrl}api/character/raw/?q=${q}&type=json`;
      // Await the response from the axios.get call
      const response = await axios.get(url, { httpsAgent: agent });

      // Extract the data from the response
      const data = response.data;

      const ouroboros = new Vars('ouroborosv1');
      const i25 = new Vars('i25');
      const decryptedData = DataHandling.decrypt(q, portalKey, portalIv);
      const character = JSON.parse(data); // Assuming character data is in JSON format

      let cData = '';
      for (const power of character.Powers) {
        if (ouroboros.exists(power.PowerName) &&
          ouroboros.exists(power.CategoryName) &&
          ouroboros.exists(power.PowerSetName)) {
          cData += `${power.PowerName} ouroboros validated\n`;
        } else {
          cData += `${power.PowerName} ouroboros fail\n`;
          cData += JSON.stringify(power, null, 2) + '\n';
        }

        if (i25.exists(power.PowerName) &&
          i25.exists(power.CategoryName) &&
          i25.exists(power.PowerSetName)) {
          cData += `${power.PowerName} issue25 validated\n`;
        } else {
          cData += `${power.PowerName} issue25 fail\n`;
          cData += JSON.stringify(power, null, 2) + '\n';
        }
      }

      res.send(`<pre>${cData}</pre>`);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Server Error');
    }
  }
}

module.exports = CharacterController;
