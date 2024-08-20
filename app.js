'use strict';
require('dotenv').config();
let debug = require('debug')('my express app');
const express = require('express');
const session = require('express-session');
const path = require('path');
const winston = require('winston');
const MonoLogger = require('./App/Util/MonoLogger');
const Redis = require('redis');
const RedisStore = require('connect-redis').default;
const SQLiteStore = require('connect-sqlite3')(session);
const sqlite3 = require('better-sqlite3');
let favicon = require('serve-favicon');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let requireDir = require('require-dir');
let routes = requireDir('./routes');

let app = express();
let PORT = process.env.PORT || 3000;

// Create a Winston logger instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console()
    ]
});

// Set the logger instance in MonoLogger
MonoLogger.setLogger(logger);
const appLogger = MonoLogger.getLogger();
appLogger.info('Logger is successfully set up!');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Configure session middleware
appLogger.info('Configuring session middleware');
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
    } catch (error) {
        appLogger.error('Failed to connect to Redis:', error);
        appLogger.info('Using default MemoryStore for Session cache instead');
        sessionStore = new session.MemoryStore();
    }
    ssReady = true;
} else if (process.env.SESSION_CACHE === "SQLite") {
    // Start setting up SQLite3 for session storage
    appLogger.info('Using ' + process.env.SESSION_CACHE + ' for Session cache');
    sessionStore = new SQLiteStore();
    ssReady = true;
}

if (!ssReady) {
    // If all else fails, use the default in-memory session storage
    appLogger.info('Using default MemoryStore for Session cache');
    sessionStore = new session.MemoryStore();
}

app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// TODO: check this is needed!
// Use express.json() to parse JSON bodies 
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

// Map routes dynamically. Saves adding each new page in.
for (let i in routes) {
    app.use('/', routes[i]);
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
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

app.set('port', PORT);

let server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
