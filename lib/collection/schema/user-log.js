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
    os: {
        type: 'String',
        required: true
    }
};