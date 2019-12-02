'use strict';

const _ = require('lodash');

/* global Simplified */

define( 'Event', {}, Simplified );
define( '__events', {}, Simplified.Event );

define( 'clear',
    function() {
        // Clear events except the core
        _.keys(Simplified.Event.__events).map( ev => {
            _.omit( Simplified.Event.__events, ev )
        });
    }, Simplified.Event );

define( 'on',
    function(event, callback) {

    }, Simplified.Event );

define( 'off',
    function(event) {

    }, Simplified.Event );

define( 'trigger',
    function( event ) {
        let args = _.values(arguments).slice(1);

    }, Simplified.Event );