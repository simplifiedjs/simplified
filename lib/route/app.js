'use strict';

/* global Simplified */

const http = require('http'),
    https = require('https'),
    express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    path = require('path'),
    app = express();

module.exports = {init, admin, client, mobile, listen};

function init() {
    require('../bootstrap')();

    // Set static paths with file restrictions
    let options = {
        index: false,
        fallthrough: true,
        dotfiles: 'ignore',
        maxAge: '365d',
        extensions: ['js', 'css', 'jpg', 'jpeg', 'png', 'gif', 'ico']
    };

    // Set static paths
    app.use(express.static(path.resolve(__dirname, '../../public'), options ) );

    if (Simplified.uploadPath) {
        app.use(express.static(Simplified.uploadPath, options ) );
    }

    if (Simplified.publicPath) {
        app.use(express.static(Simplified.publicPath, options ) );
    }

    app.use(
        cookieParser(),
        bodyParser.json(),
        bodyParser.urlencoded({extended: true})
    );
}

function admin(endPoint) {
    let adminApp = app;

    if (endPoint) {
        adminApp = express.Router();
        app.use(endPoint, adminApp);
    }

    define( 'adminApp', adminApp, Simplified );

    adminApp.use(require('./admin'));
}

function client() {
    define( 'app', app, Simplified );
}

function mobile(endPoint) {
    let mobileApp = app;

    if (endPoint) {
        mobileApp = express.Router();
        app.use(endPoint, mobileApp);
    }

    define( 'app', mobileApp, Simplified );
}

function listen(port, host, ssl) {
    define( 'app', app, Simplified );

    if (ssl) {
        return runHttps(port, host, ssl);
    }
    
    runHttp(port, host);
}

function runHttps(port, host, ssl) {
    https.createServer(app, ssl).listen(port, host);
}

function runHttp(port, host) {
    http.createServer(app).listen(port, host);
}