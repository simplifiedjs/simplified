'use strict';

/* global Collection */
const _ = require('lodash');

module.exports = {
    ID: {
        type: 'Id'
    },
    login: {
        type: 'String',
        minLength: 8,
        maxLength: 20,
        required: true,
        unique: true,
        index: true
    },
    pass: {
        type: 'String',
        required: true
    },
    email: {
        type: 'String',
        required: true,
        unique: true,
        index: true
    },
    createdAt: {
        type: 'DateTime',
        defaultValue: Collection.DateTime
    },
    group: {
        type: 'Int',
        required: true,
        index: true,
        validate(groupId) {
            if (_.isObject(groupId)) {
                return groupId.ID;
            }

            return groupId;
        },
        async onSelect(groupId) {}
    }
};