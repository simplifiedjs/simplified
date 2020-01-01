'use strict';

/* global Simplified */

const _ = require('lodash'),
    Screen = require('../screen');

class AdminScreen extends Screen {
    async render(params) {
        // Check if user is logged in

        // Check if user has administrative permission

        // Check if user has the required permission
        if (this.route.permission) {

        }

        let title = this.route.title;
        if ('function' === typeof title) {
            title = await title.call(null);
        }

        this.state.title = title;

        if (this.route.callback) {
            // Get route's state
            await this.route.callback.call(null, params, this.state);
        }

        return this.state;
    }
}

module.exports = () => new AdminScreen();