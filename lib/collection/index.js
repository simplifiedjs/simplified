'use strict';

const _ = require('lodash');

module.exports = database => {
    define( 'Collection', {} );

    let model;

    switch(database.driver) {
        default : // MySQL
            model = require('./model/mysql');
            break;
    }

    define( '__config', database, Collection );
    define( 'Model', model, Collection );
    define( 'add', addCollection, Collection );
    define( 'DateTime', getDateTime, Collection );
    define( 'Date', getDate, Collection );
};

function addCollection(name, schema = {}, methods = {}) {
    define( name, {}, Collection );
    define( 'Model', Collection.Model(name, schema), Collection[name] );

    _.forEach( methods, (value, method) => {
        define( method, value, Collection[name] );
    });

    define( 'addMethod', addMethod(name), Collection[name] );
}

function getDateTime() {

}

function getDate() {}

function addMethod(name) {
    return (methodName, method) => {
        define( methodName, method, Collection[name] );
    };
}