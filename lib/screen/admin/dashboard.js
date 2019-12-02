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
        async callback(state) {
            state.dashboards = _.memoize(getDashboard)(Dashboards);
        }
    });
}

async function getDashboard(dashboards) {
    let _dashboards = {};

    await awaitAll( _.keys(dashboards), async key => {
        let dashboard = dashboards[key];

        if (dashboard.callback) {
            dashboard.data = await dashboard.callback.call(null);
        }
        _dashboards[key] = _.omit(dashboard, 'callback');
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
     * @param callback
     */
    function({id, title, description, callback}) {
        Dashboards[id] = {id, title, description, callback};
    }, Simplified );