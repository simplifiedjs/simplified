'use strict';

const Utils = exports;

Utils.define = function(name, value) {
    if (global.hasOwnProperty(name)) {
        // Throw error
    }

    Object.defineProperty( global, name, {
        method: value,
        writable: false
    });
};