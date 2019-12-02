'use strict';

/* global Simplified */

const Screen = require('../../screen');

class AdminScreen extends Screen {
    constructor() {
        super();
    }

    async render(path, params) {
        // All screen requires login
        return this.login();

        // All screen requires administrative permission

        let route = await this.findRoute(path, params);

        if (!route) {
            // Return 404
            return this.state;
        }

        if (route.permission) {
            // Verify current user's permission
        }

        await route.callback.call(null, this.state, params);

        return this.state;
    }
}

define( 'adminScreen', new AdminScreen(), Simplified );