const crypto = require('crypto');

/**
 * Class for handling data with in the application. Provides encryption, decryption and sanitization functions.
 * @class DataHandling
 */
class DataHandling {
    /**
     * Validates a username string.
     * @static
     * @param {string} username The username to validate.
     * @throws {Error} If the username is invalid.
     */
    static validateUsername(username) {
        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            throw new Error('Username must consist of letters and numbers only; no spaces or symbols.');
        }

        if (username.length === 0 || username.length > 14) {
            throw new Error('Username must be 1-14 characters in length.');
        }
    }

    /**
     * Check the input text isn't containing any unsafe symbols.
     * 
     * @param {string} text The text to check
     * @param {number} mode if 1, check username length is within the correct bounds.
     * @returns 
     */
    static basicSanitize(text, mode = 0) {
        if (!/^[a-zA-Z0-9: ]+$/.test(text)) {
            throw new Error('text must consist of letters, spaces and numbers only; no symbols.');
        }

        if ((text.length === 0 || text.length > 14) && mode === 1) { // for usernames
            throw new Error('text must be 1-14 characters in length.');
        }
        return text;
    }

    /**
     * Validates a password string.
     * @static
     * @param {string} password The password to validate.
     * @throws {Error} If the password is invalid.
     */
    static validatePassword(password) {
        if (!/^[\x20-\x7E]+$/.test(password)) { // Printable characters check
            throw new Error('Password must consist only of letters, numbers, and symbols.');
        }

        if (password.length < 8 || password.length > 16) {
            throw new Error('Password must be 8-16 characters in length.');
        }
    }

    /**
     * Calculates the Adler-32 checksum of the given data.
     * @static
     * @param {*} data The data to calculate the checksum for.
     * @returns {number} The Adler-32 checksum. 
     */
    static adler32(data) {
        const modAdler = 65521;
        let a = 1;
        let b = 0;
        const len = data.length;
        for (let index = 0; index < len; ++index) {
            a = (a + data.charCodeAt(index)) % modAdler;
            b = (b + a) % modAdler;
        }

        return (b << 16) | a;
    }

    /**
    * Generates a hashed password using SHA-512 and Adler-32 checksum.
    * @param {string} authname The authentication name.
    * @param {string} password The password to hash.
    * @returns {Buffer} The SHA-512 hash.
    */
    static hashPassword(authname, password) {
        authname = authname.toLowerCase();
        const a32 = DataHandling.adler32(authname);
        const a32hex = a32.toString(16).padStart(8, '0');
        const reversedA32hex = a32hex.slice(6) + a32hex.slice(4, 6) + a32hex.slice(2, 4) + a32hex.slice(0, 2);
        const hash = crypto.createHash('sha512');
        hash.update(`${password}${reversedA32hex}`);
        return hash.digest();
    }

    /**
     * Generates a hashed password using SHA-512 and Adler-32 checksum.
     * @static
     * @param {string} authname The authentication name. 
     * @param {string} password The password to hash.
     * @returns {string} The hashed password as a hexadecimal string.
     */
    static binHashPassword(authname, password) {
        authname = authname.toLowerCase();
        const a32 = DataHandling.adler32(authname);
        const a32hex = a32.toString(16).padStart(8, '0');
        const reversedA32hex = a32hex.slice(6) + a32hex.slice(4, 6) + a32hex.slice(2, 4) + a32hex.slice(0, 2);
        const hash = crypto.createHash('sha512');
        hash.update(`${password}${reversedA32hex}`);
        return Buffer.from(hash.digest(), 'hex');
    }

    /**
     * Generates a hashed password using SHA-512 and Adler-32 checksum.
     * @static
     * @param {string} authname The authentication name.
     * @param {string} password The password to hash.
     * @returns {string} The hashed password as a hexadecimal string.
     */
    static binPassword(authname, password) {
        return `${DataHandling.hashPassword(authname, password).toString('hex')}`;
    }

    /**
     * Encrypts the given text using the AES-256-GCM algorithm.
     *
     * @static
     * @param {string} text The text to be encrypted.
     * @param {string} key The encryption key.
     * @param {string} iv The initialization vector.
     * @returns {string} The encrypted text in hexadecimal format, along with the authentication tag.
     */
    static encrypt(text, key, iv) {
        const cipher = crypto.createCipheriv('aes-256-gcm', DataHandling.getKey(key), DataHandling.getIv(iv));

        // Encrypt the text
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Get the authentication tag
        const authTag = cipher.getAuthTag().toString('hex');

        // Combine encrypted data and authentication tag
        return `${encrypted}:${authTag}`;
    }

    /**
     * Decrypts the given text using the AES-256-GCM algorithm.
     *
     * @param {string} text The encrypted text to be decrypted in hexadecimal format.
     * @param {string} key The encryption key used for decryption.
     * @param {string} iv The initialization vector used for decryption.
     * @returns {string} The decrypted text.
     * @static
     */
    static decrypt(text, key, iv) {
        // Split the encrypted data to get the encrypted text and authentication tag
        const [encryptedText, authTag] = text.split(':');

        // Create a decipher instance
        const decipher = crypto.createDecipheriv('aes-256-gcm', DataHandling.getKey(key), DataHandling.getIv(iv));

        // Set the authentication tag
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));

        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        try {
            decrypted += decipher.final('utf8');
        } catch (error) {
            global.appLogger.warn("DataHandling.decrypt(): couldn't decipher.final()");
        }
        return decrypted;
    }

    /**
     * Decrypts the given encrypted text using the AES-256-GCM algorithm.
     *
     * @param {string} encryptedText The encrypted text to be decrypted.
     * @param {string} key The encryption key in hexadecimal format.
     * @param {string} iv The initialization vector in hexadecimal format.
     * @returns {string} The decrypted text.
     */
    static decrypt2(encryptedData, key, iv) {
        // Split the encrypted data to get the encrypted text and authentication tag
        const [encryptedText, authTag] = encryptedData.split(':');

        // Create a decipher instance
        const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));

        // Set the authentication tag
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));

        // Decrypt the data
        let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    /**
     * Generates a key from the given key string.
     *
     * @static
     * @param {string} key The key string.
     * @returns {Buffer} The key as a buffer.
     */
    static getKey(key) {
        return crypto.createHash('sha256').update(key).digest().slice(0, 32);
    }

    /**
     * Generates an initialization vector (IV) from the given IV string.
     *
     * @static
     * @param {string} iv The IV string. 
     * @returns {Buffer} The IV as a buffer.
     */
    static getIv(iv) {
        return crypto.createHash('sha256').update(iv).digest().slice(0, 16);
    }
}

module.exports = DataHandling;
