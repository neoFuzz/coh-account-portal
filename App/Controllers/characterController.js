const DataHandling = require('../Util/dataHandling.js');
const Vars = require('../Util/Vars');

class CharacterController {
  static async dev(req, res) {
    try {
      const { q } = req.query;
      const portalKey = process.env.PORTAL_KEY;
      const portalIv = process.env.PORTAL_IV;

      if (!q || !portalKey || !portalIv) {
        return res.status(400).send('Missing required parameters');
      }

      const ouroboros = new Vars('ouroborosv1');
      const i25 = new Vars('i25');
      const decryptedData = DataHandling.decrypt(q, portalKey, portalIv);
      const character = JSON.parse(decryptedData); // Assuming character data is in JSON format

      let response = '';
      for (const power of character.Powers) {
        if (ouroboros.exists(power.PowerName) &&
            ouroboros.exists(power.CategoryName) &&
            ouroboros.exists(power.PowerSetName)) {
          response += `${power.PowerName} ouroboros validated\n`;
        } else {
          response += `${power.PowerName} ouroboros fail\n`;
          response += JSON.stringify(power, null, 2) + '\n';
        }

        if (i25.exists(power.PowerName) &&
            i25.exists(power.CategoryName) &&
            i25.exists(power.PowerSetName)) {
          response += `${power.PowerName} issue25 validated\n`;
        } else {
          response += `${power.PowerName} issue25 fail\n`;
          response += JSON.stringify(power, null, 2) + '\n';
        }
      }

      res.send(`<pre>${response}</pre>`);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Server Error');
    }
  }
}

module.exports = CharacterController;
