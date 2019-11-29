'use strict';

const Utils = exports,
    _ = require('lodash');

Utils.define = function(name, value, object = global) {
    if (object.hasOwnProperty(name)) {
        // Throw error
        return false;
    }

    Object.defineProperty( object, name, {
        value: value,
        writable: false
    });

    return true;
};
Utils.define( 'define', Utils.define );

define( 'serialize',
    /**
     * Serialize an object
     *
     * @param {*} string
     */
    function(string) {
        if (_.isObject(string)) {
            return JSON.stringify(string);
        }

        return string;
    });

define( 'unserialize',
    /**
     *
     * @param {*} string
     */
    function(string) {
        if (!string) {
            return string;
        }

        try {
            return JSON.parse(string);
        } catch(e) {
            return string;
        }
    });