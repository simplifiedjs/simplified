'use strict';

/* global ContentType */

define( 'ContentType', {} );
define( 'init',
    function() {
        ContentType.__routes = {};

    }, ContentType );

define( 'add',
    /**
     *
     * @param {string} typeId
     * @param {object|array<object>} routePath
     * @param {string} routePath.path
     * @param {function} routePath.validator
     * @param {string} routePath.title
     * @param {string} routePath.description
     * @param {function} routePath.callback
     * @param {object|array<object>} adminRoutePath
     */
    function({typeId, routePath, adminRoutePath}) {

    }, ContentType );