'use strict';

const _ = require('lodash');

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

const {columnStructure} = require('../lib/collection/model/mysql/utils');

let s = require('../lib/collection/schema/user'),
    b = require('../lib/collection/schema/user-log');

//createCollectionModel( 'user', s );

let a = [{1: 1, 2: 2, 3: 3}, {2: 2}];

let c = _.find(a, ['2']);

console.log(c);
