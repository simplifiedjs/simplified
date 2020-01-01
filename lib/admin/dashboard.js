'use strict';

/* global Simplified */
const adminScreen = Simplified.adminScreen;

Simplified.on( 'adminInit',
    /**
     *
     * @callback
     */
    function setDashboardScreen() {
        // Set dashboard screen
        adminScreen({
            routePath: '/',
            title: 'Dashboard',
            get: getAdminDashboards,
            post: postDashboard
        });
    });

async function getAdminDashboards(params, state) {}

function postDashboard(params) {}

// Define dashboard setter
define( 'adminDashboard',
    /**
     *
     * @param {string} id
     * @param {string} label
     * @param {string} description
     * @param {function} get
     * @param {function} post
     */
    function({id, label, description, permission, get, post}) {

    }, Simplified );