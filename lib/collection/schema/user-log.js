'use strict';

module.exports = {
    userId: {
        type: 'ForeignId',
        foreign: true,
        required: true,
        index: true
    },
    dateIn: {
        type: 'DateTime'
    },
    dateOut: {
        type: 'DateTime'
    },
    os: {
        type: 'String',
        length: 160
    },
    key: {
        type: 'String',
        length: 32,
        index: true,
        unique: true,
        defaultValue: () => randomSalt(64, 32, 'hex')
    }
};