'use strict';

require('../lib/bootstrap')({
    name: 'Grace',
    tagline: 'Sharing beauty of the world.',
    language: 'en',
    database: {
        driver: 'mysql',
        host: 'localhost',
        port: 3306,
        name: 'test_database',
        user: 'root',
        pass: 'root',
        prefix: 'grace_'
    }
});

let screen = Screen.get();

console.log(screen);