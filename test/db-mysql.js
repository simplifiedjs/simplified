'use strict';

const bootstrap = require('../lib/bootstrap');

bootstrap({
    database: {
        driver: 'mysql',
        database: 'test_database',
        user: 'root',
        password: 'root',
        prefix: 'test_'
    }
});