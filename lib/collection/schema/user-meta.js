'use strict';

module.exports = {
    userId: {
        type: 'ForeignId',
        required: true,
        index: true
    },
    name: {
        type: 'String',
        length: 60,
        required: true,
        index: true
    },
    value: {
        type: 'Object'
    },
    autoload: {
        type: 'Boolean'
    }
};