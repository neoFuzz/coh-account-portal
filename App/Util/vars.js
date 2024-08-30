const fs = require('fs');
const path = require('path');


/**
 * A class for managing and querying a dataset of variables.
 * 
 * @property {Array<string>} ouroboros - An array of lowercase variable names.
 * @class
 */
class Vars {
  /**
   * Creates an instance of Vars by loading data from a specified dataset.
   * 
   * @param {string} dataset - The name of the dataset directory to load.
   * @throws {Error} Throws an error if the dataset file cannot be read.
   */
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

  /**
   * Checks if a specific variable exists in the dataset.
   * 
   * @param {string} needle - The variable to check for existence.
   * @returns {boolean} True if the variable exists, false otherwise.
   */
  exists(needle) {
    return this.ouroboros.includes(needle.toLowerCase());
  }
}

module.exports = Vars;
