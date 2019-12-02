'use strict';

/* global Simplified */

module.exports = init;

async function init(req, res, next) {
    // Clean-up all hooked events
    Simplified.Event.clear();

    // Load files

    // Fire init event
    await Simplified.Event.trigger( 'init' );

    next();
}