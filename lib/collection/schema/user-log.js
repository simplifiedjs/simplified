'use strict';

module.exports = {
    userId: {
        type: 'ForeignId',
        foreign: true,
        required: true,
        index: true
    },
    dateIn: {
        type: 'DateTime',
        defaultValue: 'DateTime'
    },
    dateOut: {
        type: 'DateTime',
        update: true
    },
    os: {
        type: 'String',
        length: 160
    },
    status: {
        type: 'Enum',
        enum: ['in', 'out']
    },
    key: {
        type: 'String',
        length: 32,
        primary: true,
        defaultValue: () => randomSalt(64, 32, 'hex')
    }
};