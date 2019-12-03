'use strict';

/* global Simplified */

const adminScreen = Simplified.adminScreen;

module.exports = settingsInit;

function settingsInit() {
    // App settings
    adminScreen.add({
        routePath: '/settings',
        title: 'Settings',
        callback(state) {}
    });
}