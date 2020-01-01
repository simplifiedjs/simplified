'use strict';

/* global Simplified */

const {setUp} = require('../index'),
    bootstrap = require('../lib/bootstrap');

setUp({
    database: {
        driver: 'mysql',
        database: 'test_database',
        user: 'root',
        password: 'root',
        prefix: 'test_'
    },
    mailer: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'login',
            user: 'simplifiedjs@gmail.com',
            pass: 'Kathrina21'
        }
    }
});

bootstrap();

// Trigger init
Simplified.trigger( 'init' );