'use strict';

module.exports = {
    ID: {
        type: 'Id'
    },
    name: {
        type: 'String',
        length: 120,
        required: true,
        unique: true
    },
    event: {
        type: 'String',
        required: true,
        index: true,
        unique: true
    },
    type: {
        type: 'enum',
        enum: ['text', 'html'],
        defaultValue: 'html'
    },
    from: {
        type: 'String',
        length: 120
    },
    subject: {
        type: 'String',
        length: 160,
        required: true
    },
    body: {
        type: 'String',
        required: true
    }
};