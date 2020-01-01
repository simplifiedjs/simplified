'use strict';

/* global Simplified */
const adminScreen = Simplified.AdminScreen;

Simplified.on( 'adminInit',
    function() {
        // Set users screen
        adminScreen.add({
            routePath: [
                '/users',
                '/users/page/:page',
                '/users/:group',
                '/users/:group/page/:page',
                '/users/:search',
                '/users/:search/page/:page'
            ],
            permission: 'manage-users'
        });

        // Set edit user screen
        adminScreen.add({
            routePath: '/users/:id',
            permission: 'manage-users'
        });

        // Set user group screen
        adminScreen.add({
            routePath: [
                '/users/group',
                '/users/group/:group'
            ],
            permission: 'manage-users'
        });
    });