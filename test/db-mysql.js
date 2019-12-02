'use strict';

const bootstrap = require('../lib/bootstrap');

bootstrap({
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