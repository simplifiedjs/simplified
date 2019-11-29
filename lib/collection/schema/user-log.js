'use strict';

module.exports = {
    userId: {
        type: 'Int',
        required: true,
        index: true
    },
    dateIn: {
        type: 'DateTime',
        defaultValue: Collection.DateTime
    },
    dateOut: {
        type: 'DateTime'
    },
    os: {
        type: 'String',
        required: true
    },
    key: {
        type: 'String',
        length: 32,
        index: true,
        unique: true,
        defaultValue: () => randomSalt(64, 32, 'hex')
    }
};