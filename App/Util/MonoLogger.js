const winston = require('winston');

class MonoLogger {
    static logger = null;

    /**
     * Set the logger instance.
     *
     * @param {winston.Logger} logger The winston logger instance to set.
     */
    static setLogger(logger) {
        if (!(logger instanceof winston.Logger)) {
            throw new Error('Expected an instance of winston.Logger');
        }
        MonoLogger.logger = logger;
    }

    /**
     * Get the logger instance.
     *
     * @returns {winston.Logger} The winston logger instance.
     * @throws {Error} Throws an error if the logger is not set.
     */
    static getLogger() {
        if (MonoLogger.logger === null) {
            throw new Error('Logger not set');
        }
        return MonoLogger.logger;
    }
}

module.exports = MonoLogger;
