'use strict';

const http = require('http'),
    https = require('https'),
    express = require('express'),
    app = express(),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    {define}  = require('./lib/utils');

module.exports = (config, callback, middleWares) => new Setup(config, callback, middleWares);

function Setup(config, callback, middleWares) {
    const {absPath, publicPath, uploadPath} = config;

    // Define global variables
    define( 'ABSPATH', absPath || process.cwd() );
    define( 'PublicPath', publicPath );
    define( 'UploadPath', uploadPath );

    // Set static paths with file restrictions
    let options = {
        index: false,
        fallthrough: true,
        dotfiles: 'ignore',
        maxAge: '365d',
        extensions: ['js', 'css', 'jpg', 'jpeg', 'png', 'gif']
    };

    if (publicPath) {
        app.use(express.static(publicPath, options));
    }

    if (uploadPath) {
        app.use(express.static(uploadPath, options));
    }

    app.use(cookieParser(), bodyParser.json(), bodyParser.urlencoded({extended: true}));

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