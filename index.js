'use strict';

/* global Simplified */

const _ = require('lodash'),
    app = require('./lib/route/app'),
    {define} = require('./lib/utils'),
    sEvent = require('./lib/event');

module.exports = function(config) {
    if (_.isString(config)) {
        // If it's a file path, fetch it!
        try {
            config = require(config);
        } catch(e) {
            return false;
        }
    }

    define( config, false, Simplified );

    return {listen, admin, client, mobile};
};

define( 'Simplified', sEvent() );

// Set version
define( 'version', '1.0.0.beta', Simplified );

/**
 * Runs the application which listens to client, admin, and mobile handler.
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
 * Listens to administrative request.
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
 * Listens to client requests only.
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
 * Listens to mobile requests only.
 *
 * @param port
 * @param host
 * @param {object} ssl
 */
function mobile(port, host, ssl) {
    app.init();
    app.mobile();
    app.listen(port, host, ssl);
}