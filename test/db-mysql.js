'use strict';

const bootstrap = require('../lib/bootstrap'),
    _ = require('lodash');

bootstrap({
    database: {
        type: 'mysql',
        name: 'test_database',
        user: 'root',
        pass: 'root',
        prefix: 'test_'
    }
});

console.log(Collection);