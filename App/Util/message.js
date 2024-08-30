const { decrypt, encrypt } = require('./dataHandling');

/**
 * Class representing a message.
 * 
 * @property {string} to - The recipient of the message.
 * @property {string} from - The sender of the message.
 * @property {Object} data - The data to be sent in the message.
 * @property {string} encryptedData - The encrypted data to be sent in the message.
 * 
 * @class Message
 */
class Message {
    /**
     * Creates an instance of Message.
     *
     * @param {string} to   The recipient of the message.
     * @param {string} from The sender of the message.
     */
    constructor(to = '', from = '') {
        this.to = to;
        this.from = from || process.env.PORTAL_NAME; // Use environment variable if from is not provided
        this.data = {};
        this.encryptedData = '';
    }

    /**
     * Serializes the message into a JSON string.
     *
     * @returns {Object} The JSON representation of the message.
     */
    toJSON() {
        this._serialize();
        return {
            To: this.to,
            From: this.from,
            Message: this.encryptedData
        };
    }

    /**
     * Deserializes the message from a JSON string.
     *
     * @static
     * @param {string} json The JSON string to deserialize.
     * @returns {JSON} The deserialized message. 
     */
    static fromJSON(json) {
        const data = JSON.parse(json);
        const message = new Message(data.To, data.From);
        message.encryptedData = data.Message;
        message._deserialize();
        return message;
    }

    /**
     * Serializes the message data into an encrypted string.
     *
     * @private
     */
    _serialize() {
        const fedServer = this._findFederationServerByName(this.to);
        this.encryptedData = encrypt(JSON.stringify(this.data), fedServer.Crypto.key, fedServer.Crypto.iv);
    }

    /**
     * Deserializes the message data from an encrypted string.
     *
     * @private
     */
    _deserialize() {
        const fedServer = this._findFederationServerByName(this.to);
        this.data = JSON.parse(decrypt(this.encryptedData, fedServer.Crypto.key, fedServer.Crypto.iv));
    }

    /**
     * Finds a federation server by name.
     *
     * @private
     * @param {string} name The name of the federation server to find.
     * @returns {Object} The federation server object.
     */
    _findFederationServerByName(name) {
        const federationServers = global.federation;
        return federationServers.find(item => item.Name.toLowerCase().includes(name.toLowerCase()));
    }

    /**
     * Sets a value in the message data.
     *
     * @param {*} name The name of the value to set.
     * @param {*} value The value to set.
     */
    set(name, value) {
        this.data[name] = value;
    }

    /**
     * Gets a value from the message data.
     *
     * @param {string} name The name of the value to get.
     * @returns {*} The value.
     */
    get(name) {
        return this.data[name];
    }

    /**
     * Checks if a value exists in the message data.
     *
     * @param {*} name The name of the value to check.
     * @returns {boolean} True if the value exists, false otherwise.
     */
    has(name) {
        return this.data.hasOwnProperty(name);
    }

    /**
     * Deletes a value from the message data.
     *
     * @param {*} name The name of the value to delete.
     */
    delete(name) {
        delete this.data[name];
    }
}

module.exports = Message;
