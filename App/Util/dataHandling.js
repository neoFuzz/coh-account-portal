const crypto = require('crypto');

class DataHandling {
    static validateUsername(username) {
        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            throw new Error('Username must consist of letters and numbers only; no spaces or symbols.');
        }

        if (username.length === 0 || username.length > 14) {
            throw new Error('Username must be 1-14 characters in length.');
        }
    }

    static checkUsername(username) {
        if (!/^[a-zA-Z0-9]+$/.test(username)) {
            throw new Error('Username must consist of letters and numbers only; no spaces or symbols.');
        }

        if (username.length === 0 || username.length > 14) {
            throw new Error('Username must be 1-14 characters in length.');
        }
        return username;
    }

    static validatePassword(password) {
        if (!/^[\x20-\x7E]+$/.test(password)) { // Printable characters check
            throw new Error('Password must consist only of letters, numbers, and symbols.');
        }

        if (password.length < 8 || password.length > 16) {
            throw new Error('Password must be 8-16 characters in length.');
        }
    }

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
    * @param {string} authname - The authentication name.
    * @param {string} password - The password to hash.
    * @returns {Buffer} - The SHA-512 hash.
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

    static binHashPassword(authname, password) {
        authname = authname.toLowerCase();
        const a32 = DataHandling.adler32(authname);
        const a32hex = a32.toString(16).padStart(8, '0');
        const reversedA32hex = a32hex.slice(6) + a32hex.slice(4, 6) + a32hex.slice(2, 4) + a32hex.slice(0, 2);
        const hash = crypto.createHash('sha512');
        hash.update(`${password}${reversedA32hex}`);
        return Buffer.from(hash.digest(), 'hex');
    }

    static binPassword(authname, password) {
        return `${DataHandling.hashPassword(authname, password).toString('hex')}`;
    }

    static encrypt(text, key, iv) {
        const cipher = crypto.createCipheriv('aes-256-cbc', DataHandling.getKey(key), DataHandling.getIv(iv));
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    /**
     * Decrypts the given text using the AES-256-CBC algorithm.
     *
     * @param {string} text - The encrypted text to be decrypted in hexadecimal format.
     * @param {string} key - The encryption key used for decryption.
     * @param {string} iv - The initialization vector used for decryption.
     * @returns {string} The decrypted text.
     * @static
     */
    static decrypt(text, key, iv) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', DataHandling.getKey(key), DataHandling.getIv(iv));
        let decrypted = decipher.update(text, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    /**
     * Decrypts the given encrypted text using the AES-256-CBC algorithm.
     *
     * @param {string} encryptedText - The encrypted text to be decrypted.
     * @param {string} key - The encryption key in hexadecimal format.
     * @param {string} iv - The initialization vector in hexadecimal format.
     * @returns {string} The decrypted text.
     */
    static decrypt2(encryptedText, key, iv) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

    static getKey(key) {
        return crypto.createHash('sha256').update(key).digest().slice(0, 32);
    }

    static getIv(iv) {
        return crypto.createHash('sha256').update(iv).digest().slice(0, 16);
    }
}

module.exports = DataHandling;
