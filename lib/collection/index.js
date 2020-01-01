'use strict';

/* global Simplified */

define( 'Collection', {}, Simplified );

const _ = require('lodash'),
    sEvent = require('../event'),
    Collection = Simplified.Collection;

define( 'Model',
    /**
     * Set's collection model base on the selected driver.
     */
    function() {
        switch(Simplified.database.driver) {
            default : // MySQL
                return require('./model/mysql');
        }
    }(), Collection );

define( 'add',
    /**
     * Adds collection model.
     *
     * @param {string} name
     * @param {object} schema               The model's collection or table structure.
     * @param {object} methods              A set of methods made available to transact unto the collection.
     */
    function(name, schema = {}, methods = {}) {
        let _methods = sEvent();

        // Always clear the list of subscribers
        Simplified.on( 'init', _methods.reset );

        // Iterate and set methods
        _.forEach( methods, (value, method) => define( method, value, _methods) );

        _methods.Model = Collection.Model(name, schema);

        define( name, _methods, Collection );

    }, Collection );