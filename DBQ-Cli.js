'use strict';
require('dotenv').config();
const DBQuery = require('./App/Util/dbquery');
const winston = require('winston');
const MonoLogger = require('./App/Util/MonoLogger');

// Create a Winston logger instance
const customFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(), // Adds the timestamp
        customFormat
    ),
    transports: [
        new winston.transports.Console()
    ]
});

// Set the logger instance in MonoLogger - It is a wrapper class to help with code converted from PHP
MonoLogger.setLogger(logger);
global.appLogger = MonoLogger.getLogger();
global.appLogger.info('Logger is successfully set up!');


// ************ App


DBQuery.communicate(2);
//DBQuery.cpacket_test(2);

const hexString = 'fe000000649207f40a00000000a70100008000000080ffffffffa75c0a40cf2900000000'; //cont 3
//                           |---|                                               |
//                "fe000000644207e40a00000000a70100008000000080ffffffffa75c0a40cf1900000000"; //cont 2
//                "df0000001496020108000000740000000000ff040100008000000000"

// const Packet = require('./App/Util/Packet');
// let pak = new Packet(1472);
// pak.initBitStream();

console.log("End!");