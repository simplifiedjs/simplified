'use strict';

/* global Collection, serialize, unserialize */

module.exports = {
    name: {
        type: 'String',
        length: 60,
        required: true,
        primary: true,
        unique: true,
        index: true
    },
    value: {
        type: 'Object'
    },
    autoload: {
        type: 'Boolean'
    }
};