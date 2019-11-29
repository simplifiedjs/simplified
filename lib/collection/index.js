'use strict';

/* global Collection */

const _ = require('lodash');

define( 'Model',
    /**
     * Set's collection model base on the selected driver.
     */
    function() {
        switch(Collection.__config.driver) {
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
        define( 'Model', Collection.Model(name, schema), Collection[name] );

        _.forEach( methods, (value, method) => define( method, value, Collection[name] ));

        //define( 'addMethod', addMethod(name), Collection[name] );

    }, Collection );

define( 'Date',
    function() {

    }, Collection );

define( 'DateTime',
    function() {

    }, Collection );