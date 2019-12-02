'use strict';

/* global Simplified */

const adminScreen = Simplified.adminScreen;

module.exports = adminUsers;

function adminUsers() {
    // Users List
    adminScreen.add({
        routePath: [
            '/users',
            '/users/page/:page',
            '/users/:group',
            '/users/:group/page/:page'
        ],
        title: 'Users',
        description: 'Manage system users.',
        permission: 'manage-users',
        callback(state, params) {
            state.params = params;
        }
    });

    // Add User
    adminScreen.add({
        routePath: '/user/new',
        title: 'New User',
        description: 'Add new system user.',
        permission: 'add-user',
        callback(state) {}
    });

    // Edit user profile
    adminScreen.add({
        routePath: '/user/:id',
        title: 'Edit User',
        permission: 'edit-user',
        callback(state) {}
    });

    // Edit Profile
    adminScreen.add({
        routePath: '/profile',
        title: 'Personal Profile',
        callback(state) {}
    });

    // User Group
    adminScreen.add({
        routePath: '/users/group',
        title: 'User Group',
        permission: 'manage-users',
        callback(state) {}
    });

    // Add/edit user group
    adminScreen.add({
        routePath: '/users/group/:groupId',
        title: 'Edit User Group',
        permission: 'manage-users',
        callback(state) {}
    });
}