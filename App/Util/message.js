const crypto = require('crypto');
const { decrypt, encrypt } = require('./dataHandling'); // Adjust the path to your utility functions

class Message {
    constructor(to = '', from = '') {
        this.to = to;
        this.from = from || process.env.PORTAL_NAME; // Use environment variable if from is not provided
        this.data = {};
        this.encryptedData = '';
    }

    toJSON() {
        this._serialize();
        return {
            To: this.to,
            From: this.from,
            Message: this.encryptedData
        };
    }

    static fromJSON(json) {
        const data = JSON.parse(json);
        const message = new Message(data.To, data.From);
        message.encryptedData = data.Message;
        message._deserialize();
        return message;
    }

    _serialize() {
        const fedServer = this._findFederationServerByName(this.to);
        this.encryptedData = encrypt(JSON.stringify(this.data), fedServer.Crypto.key, fedServer.Crypto.iv);
    }

    _deserialize() {
        const fedServer = this._findFederationServerByName(this.to);
        this.data = JSON.parse(decrypt(this.encryptedData, fedServer.Crypto.key, fedServer.Crypto.iv));
    }

    _findFederationServerByName(name) {
        const federationServers = global.federation;
        return federationServers.find(item => item.Name.toLowerCase().includes(name.toLowerCase()));
    }

    set(name, value) {
        this.data[name] = value;
    }

    get(name) {
        return this.data[name];
    }

    has(name) {
        return this.data.hasOwnProperty(name);
    }

    delete(name) {
        delete this.data[name];
    }
}

module.exports = Message;
