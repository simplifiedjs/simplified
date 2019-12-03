'use strict';

/* global Simplified */

define( 'Collection', {}, Simplified );

const _ = require('lodash'),
    modelMethods = require('./methods'),
    sEvent = require('../event'),
    Collection = Simplified.Collection;

define( 'Model',
    /**
     * Set's collection model base on the selected driver.
     */
    function() {
        switch(Simplified.__database.driver) {
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
        define( name, {}, Collection );

        // Add access to model collection
        define( 'Model', Collection.Model(name, schema), Collection[name] );

        // Enable event hook
        define( 'Event', sEvent(), Collection[name] );

        // Set model methods
        let _methods = modelMethods(name);
        methods = _.extend( methods || {}, _methods );

        // Iterate and set methods
        _.forEach( methods, (value, method) => define( method, value, Collection[name]) );

    }, Collection );

define( 'Date',
    function() {

    }, Collection );

define( 'DateTime',
    function() {

    }, Collection );