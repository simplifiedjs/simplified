'use strict';

/* global Collection */
const _ = require('lodash');

module.exports = {
    ID: {
        type: 'Id'
    },
    login: {
        type: 'String',
        length: 20,
        required: true,
        unique: true,
        index: true
    },
    pass: {
        type: 'String',
        required: true,
        async validate(value) {
            let match = value.toString().match(/;\)/g);

            if (_.isNull(match) || match.length < 2 ) {
                // Encrypt password
                let [err, hash] = await generateHashKey(value.toString());

                if (err) {
                    return err;
                }

                value = hash;
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
            if (!value && !isEmail(value)) {
                return errorCode('invalidEmail');
            }

            return value;
        }
    },
    createdAt: {
        type: 'DateTime',
        defaultValue: 'DateTime'
    },
    group: {
        type: 'ForeignId',
        required: true,
        index: true,
        validate(groupId) {
            if (!groupId) {
                return errorCode('invalidGroupId');
            }

            if (_.isObject(groupId)) {
                return groupId.ID;
            }

            return groupId;
        }
    }
};