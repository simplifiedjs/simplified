'use strict';

/* global Simplified */

const _ = require('lodash'),
    app = require('./lib/route/app'),
    {define} = require('./lib/utils');

module.exports = {setUp, listen, admin, client, mobile};

define( 'Simplified', {version: '1.0.0-beta'} );

/**
 * Sets the application's configuration.
 *
 * @param {string|object} config
 * @param {string} config.name
 * @param {string} config.description
 * @param {object} config.database
 * @param {object} config.mail
 */
function setUp(config) {
    if (_.isString(config)) {
        // Assume absolute path
        config = require(config);
    }

    const {name, description, publicPath, uploadPath, database, mail} = config;

    define( 'name', name, Simplified );
    define( 'description', description, Simplified );
    define( 'publicPath', publicPath, Simplified );
    define( 'uploadPath', uploadPath, Simplified );
    define( '__database', database, Simplified );
    define( '__mail', mail, Simplified );
}

/**
 * Runs the application server, including client, admin, and mobile.
 *
 * @param {int} port
 * @param {string} host
 * @param {object} ssl
 */
function listen(port, host, ssl) {
    app.init();

    // Set admin with end-point
    app.admin('/admin');

    // Set client
    app.client();

    // Set mobile listener
    app.mobile('/m/api');

    app.listen(port, host, ssl);
}

/**
 * Runs the administration area server.
 *
 * @param port
 * @param host
 * @param {object} ssl
 */
function admin(port, host, ssl) {
    app.init();
    app.admin();
    app.listen(port, host, ssl);
}

/**
 * Runs the client side server.
 *
 * @param port
 * @param host
 */
function client(port, host, ssl) {
    app.init();
    app.client();
    app.listen(port, host, ssl);
}

/**
 * Runs the mobile handler server.
 * @param port
 * @param host
 * @param {object} ssl
 */
function mobile(port, host, ssl) {
    app.init();
    app.mobile();
    app.listen(port, host, ssl);
}

/**

const http = require('http'),
    https = require('https'),
    express = require('express'),
    app = express(),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    path = require('path'),
    admin = require('./lib/route/admin'),
    {define}  = require('./lib/utils');

module.exports = (config, callback, middleWares) => new Setup(config, callback, middleWares);

function Setup(config, callback, middleWares) {
    // Autoload
    require('./lib/bootstrap')(config);

    // Set static paths with file restrictions
    let options = {
        index: false,
        fallthrough: true,
        dotfiles: 'ignore',
       // maxAge: '365d',
        extensions: ['js', 'css', 'jpg', 'jpeg', 'png', 'gif', 'ico']
    };

    // Serve public path
    app.use(express.static(path.resolve(__dirname, './public'), options));

    if (PUBLIC_PATH) {
        app.use(express.static(PUBLIC_PATH, options));
    }

    if (UPLOAD_PATH) {
        app.use(express.static(UPLOAD_PATH, options));
    }

    app.use(
        cookieParser(),
        bodyParser.json(),
        bodyParser.urlencoded({extended: true})
        //require('./lib/route/middleware')
    );

    if (callback) {
        callback.call(null, app);
    }

    if (middleWares) {
        //app.use(middleWares);
    }
}

Setup.prototype.client = function(port, host, ssl) {
    // Record client list
    app.get('*', handleGet);

    if (ssl) {
        this.https(port, host, ssl);

        return this;
    }

    this.http(port, host);

    return this;
};

Setup.prototype.admin = function(port, host, ssl) {
    define( 'app', app, AdminScreen );

    app.use(admin.init);
    app.get('/favicon.ico', (req, res) => {
        res.end();
    });

    if (ssl) {
        this.https(port, host, ssl);

        return this;
    }

    this.http(port, host);

    return this;
};

Setup.prototype.http = function(port, host) {
    http.createServer(app).listen(port, host);

    return this;
};

Setup.prototype.https = function(port, host, ssl) {
    return this;
};

function handleGet(req, res) {
    let admin = app.IS_ADMIN ? 'YES' : 'NO';

    res.end(admin);
}
 **/