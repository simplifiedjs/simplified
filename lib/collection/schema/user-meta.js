'use strict';

module.exports = {
    userId: {
        type: 'Int',
        required: true,
        index: true
    },
    name: {
        type: 'String',
        maxLength: 60,
        required: true,
        index: true
    },
    value: {
        type: 'Any'
    }
};