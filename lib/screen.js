'use strict';

const _ = require('lodash');

class Screen {
    constructor() {
        this.routes = {};
        this.state = {};
        this.subscribers = [];
    }

    reset(state) {
        // Clear routes
        this.routes = {};
        this.state = state || {};
        this.subscribers = [];
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    get(name) {
        if (!name) {
            return this.state;
        }

        return this.state[name];
    }

    set(name, value) {
        if ( _.isObject(name) && ! _.isArray(name)) {
            this.state = _.extend(this.state, name);

            return;
        }

        this.state[name] = value;
    }

    unset(name) {
        if (!this.state[name]) {
            return;
        }

        _.omit(this.state, name);
    }

    add({routePath, title, description, validate, callback}) {
        if (this.routes[routePath]) {
            return false;
        }

        if (_.isArray(routePath)) {
            return routePath.map( r => {
                let route = {title, description, validate, callback};
                route.routePath = r;

                this.add(route);
            });
        }

        this.routes[routePath] = _.omitBy({title, description, validate, callback}, _.isUndefined);
    }

    notFound() {
        _.extend(this.state, {
            title: 'Page Not Found'
        });
    }

    login() {
        _.extend(this.state, {
            typeNow: 'login',
            title: 'Login'
        });

        return this.state;
    }

    async findRoute(path, params) {
        let route = false,
            found = false;

        await awaitAll(_.keys(this.routes), async routePath => {
            if (found) {
                return;
            }

            let routeDef = this.routes[routePath];

            if (_.isEqual(path, routePath)) {
                if (!routeDef.validate) {
                    route = routeDef;
                    found = true;
                }
            }

            if (_.isArray(routePath)) {
                _.map( routePath, _path => {
                    if (_.isEqual(_path, path)) {
                        route = routeDef;
                        found = true;
                    }
                });
            }
        });

        if (route) {
            let {title, description} = route;

            // Get screen title
            if ('function' === typeof title) {
                title = await title.call(null, params);
            }

            this.state.title = title;

            // Get screen description
            if ('function' === typeof description) {
                description = await description.call(null, params);
            }

            this.state.description = description;
        }

        return route;
    }

    async render(path) {
        let route = await this.findRoute(path);

        if (!route) {
            // Return 404
        }

        if (route.isGuest) {
            // Check if the screen is for guest only
        }

        if (route.requireLogin) {
            // Check if screen is for logged in users only
        }

        if (route.permission) {
            // Verify current user's permission
        }

        await route.callback.call(null, this.state);

        return this.state;
    }
}

module.exports = Screen;