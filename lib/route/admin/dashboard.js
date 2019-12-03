'use strict';

/* global Simplified */
const _ = require('lodash');

module.exports = dashboard;

let Dashboards = {};

function dashboard() {
    // Clear dashboard list
    Dashboards = {};

    Simplified.adminScreen.add({
        routePath: '/',
        title: 'Dashboard',
        callback: getDashboards
    });
}

async function getDashboards() {
    let dashboards = Dashboards,
        _dashboards = {};

    // todo: remove inactive

    await awaitAll( _.keys(dashboards), async key => {
        let dashboard = dashboards[key];

        if (dashboard.getCallback) {
            dashboard.data = await dashboard.getCallback.call(null);
        }
        _dashboards[key] = _.omit(dashboard, 'getCallback');
    });

    return _dashboards;
}

define('adminDashboard',
    /**
     * Adds dashboard data in administration area.
     *
     * @param id
     * @param title
     * @param description
     * @param {function} getCallback                    A callback function to run when rendering the dashboard.
     */
    function({id, title, description, getCallback}) {
        Dashboards[id] = {id, title, description, getCallback};
    }, Simplified );