const fs = require('fs');
const path = require('path');

class Vars {
  constructor(dataset) {
    this.ouroboros = [];

    const dataPath = path.join(__dirname, '..', 'data', dataset);
    const filePath = path.join(dataPath, 'vars.attribute');

    if (fs.existsSync(dataPath) && fs.existsSync(filePath)) {
      try {
        const data = fs.readFileSync(filePath, 'utf8');
        const matches = data.match(/"([^"]+)"/g);

        if (matches) {
          this.ouroboros = matches.map(match => match.replace(/"/g, '').toLowerCase());
        }
      } catch (error) {
        throw new Error(`Unable to read ${filePath}: ${error.message}`);
      }
    }
  }

  exists(needle) {
    return this.ouroboros.includes(needle.toLowerCase());
  }
}

module.exports = Vars;
