'use strict';

/* global Collection, serialize, unserialize */

module.exports = {
    name: {
        type: 'String',
        required: true,
        primary: true,
        unique: true,
        index: true
    },
    value: {
        type: 'Any'
    },
    autoload: {
        type: 'Boolean'
    }
};