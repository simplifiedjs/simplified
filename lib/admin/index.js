'use strict';

/* global Simplified */
const _ = require('lodash');

define( 'adminScreen',
    /**
     * Sets an administrative screen callback.
     *
     * @param {string|array} routePath
     * @param {string} title
     * @param {string} description
     * @param {string} permission
     * @param {function} validate
     * @param {string} component
     * @param {function} get
     * @param {function} post
     */
    function({routePath, title, description, permission, validate, component, get, post}) {
        if (!_.isArray(routePath)) {
            routePath = [routePath];
        }

        return routePath.map( route => {
            let routeData = _.omitBy({title, description, permission, validate, component}, _.isUndefined);
            routeData.route = route;

            if (get) {
                Simplified.adminGetRoutes[route] = _.extend({callback: get}, routeData);
            }

            if (post) {
                Simplified.adminPostRoutes[route] = _.extend({callback: post}, routeData);
            }
        });
    }, Simplified );