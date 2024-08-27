'use strict';
require('dotenv').config();
const https = require('https');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const path = require('path');
const winston = require('winston');
const MonoLogger = require('./App/Util/MonoLogger');
const crypto = require('crypto');
const Redis = require('redis');
const RedisStore = require('connect-redis').default;
const SQLiteStore = require('connect-sqlite3')(session);
const helmet = require('helmet');
const csurf = require('@dr.pogodin/csurf');
let favicon = require('serve-favicon');
let cookieParser = require('cookie-parser');
let requireDir = require('require-dir');
let routes = requireDir('./routes');
const globalData = require('./App/Middleware/globalData');

let app = express();
let PORT = process.env.PORT || 3000;

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
const appLogger = global.appLogger;

// ******** Check for HTTPS setup ********
let httpsSet = false;
const options = {
    key: '', // blank objects
    cert: ''
};

// Check SSL certificate and key exist
if (fs.existsSync(process.env.KEY) && fs.existsSync(process.env.CERTIFICATE)) {
    // Load SSL certificate and key
    options.key = fs.readFileSync(process.env.KEY);
    options.cert = fs.readFileSync(process.env.CERTIFICATE);
    httpsSet = true;
    appLogger.info('SSL certificate and key found. HTTPS will be enabled.');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Configure session middleware
appLogger.info('Configuring session middleware...');

// If favicon-serve isn't set up first, causes some weird problems
app.use(favicon(__dirname + '/public/favicon.ico'));

// Session cache set up
let sessionStore;
let ssReady = false;

if (process.env.SESSION_CACHE === "redis") {
    // Start setting up Redis
    appLogger.info('Using Redis for Session cache');

    // Ensure Redis server is running
    const redisClient = Redis.createClient();
    try {
        redisClient.connect().catch(logger.error);
        sessionStore = new RedisStore({ client: redisClient, prefix: 'cohap:' });
        ssReady = true;
    } catch (error) {
        appLogger.error('Failed to connect to Redis:', error);
        appLogger.info('Using default MemoryStore for Session cache instead');
        sessionStore = new session.MemoryStore();
    }
} else if (process.env.SESSION_CACHE === "SQLite") {
    // Start setting up SQLite3 for session storage
    appLogger.info('Using ' + process.env.SESSION_CACHE + ' for Session cache');
    sessionStore = new SQLiteStore();
    ssReady = true;
}

if (!ssReady) {
    // If all else fails, use the default in-memory session storage
    appLogger.warn('Using default MemoryStore for Session cache');
    sessionStore = new session.MemoryStore();
}

// Finish session store setup
app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: httpsSet
    }
}));

// Set up more Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(globalData);

// CSRF protection stuff
let csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);

app.use(function (req, res, next) {
    res.cookie("csrf-token", req.csrfToken());
    next();
});

// Middleware to generate nonce and add to response locals
app.use((req, res, next) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
    next();
});

// Middleware to set CSP header
app.use((req, res, next) => {
    const nonce = res.locals.cspNonce;
    res.setHeader("Content-Security-Policy", `script-src 'self' 'nonce-${nonce}'`);
    next();
});

// TODO: Change SqlServer in to a wrapper class to allow other types of SQL servers (like Postgres)
// Setup SQL Server wrapper module
//global.sqlServer = new (require('./App/Util/SqlServer'))(process.env.DB_CONNECTION);

// ******** Map routes ********
appLogger.info('Mapping routes...');

// We map the routes dynamically. This saves adding each new page and having an unweildly list.
for (let i in routes) {
    appLogger.info('Mapping routes from ' + i);
    app.use('/', routes[i]);
}

// ******** set up server federation ********
appLogger.info("Initiating server federation...");

// Load the JSON file
const filePath = path.join(__dirname, 'federation-config.json');
const fileContent = fs.readFileSync(filePath, 'utf8');

// Parse the JSON data
global.federation = [];
try {
    global.federation = JSON.parse(fileContent);
} catch (e) {
    appLogger.warn('Problem with importing servers from file: ', e);
    appLogger.warn('Check the file is a vaild JSON file. Continuing without federation...');
}

// Iterate over the federation object and log the server names
for (let server in global.federation) {
    if (global.federation.hasOwnProperty(server)) {
        appLogger.info("Added Federation Server: " + global.federation[server].Name);
    }
}

// ******** Setup error handlers ********
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (process.env.portal_error_reporting === 'dev') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// ******** Start the web service ********
app.set('port', PORT);
if (httpsSet) {
    // Create HTTPS server
    https.createServer(options, app).listen(PORT, () => {
        global.appLogger.info('Web Server using HTTPS running on port ' + PORT);
        global.httpUrl = `https://${process.env.PORTAL_URL}${PORT === '443' ? "" : ":"+PORT}/`;

    });
} else {
    app.listen(app.get('port'), function () {
        global.appLogger.info("Web server is running on port " + PORT);
        global.appLogger.warn("It is recommended to use HTTPS instead!");
        global.httpSet = `http://${process.env.PORTAL_URL}:${PORT}/`;
    });
}