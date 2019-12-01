'use strict';

module.exports = {
    ID: {
        type: 'Id'
    },
    name: {
        type: 'String',
        length: 60,
        required: true,
        index: true,
        unique: true
    },
    roles: {
        type: 'Array'
    }
};