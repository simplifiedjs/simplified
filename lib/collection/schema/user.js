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
        required: true,
        async validate(value) {
            let match = value.match(/;\)/g);

            if (_.isNull(match) || match.length < 2 ) {
                // Encrypt password
                value = await generateHashKey(value);
            }

            return value;
        }
    },
    email: {
        type: 'String',
        required: true,
        unique: true,
        index: true,
        validate(value) {
            // Check if it's valid email address
            if (!isEmail(value)) {
                return setError(null, 'invalidEmail');
            }

            return value;
        }
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