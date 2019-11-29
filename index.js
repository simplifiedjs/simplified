'use strict';

const http = require('http'),
    https = require('https'),
    express = require('express'),
    app = express(),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    path = require('path'),
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
        bodyParser.urlencoded({extended: true}),
        require('./lib/route/middleware')
    );

    if (callback) {
        callback.call(null, app);
    }

    if (middleWares) {
        app.use(middleWares);
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
    app.isAdmin = true;
    define('IS_ADMIN', true );

    require('./lib/route/admin')(app);

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

function isAdmin(req, res, next) {

    next();
}

function handleGet(req, res) {
    let admin = app.IS_ADMIN ? 'YES' : 'NO';

    res.end(admin);
}