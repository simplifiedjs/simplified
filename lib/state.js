'use strict';

const _ = require('underscore'),
    routes = {};

class State {
    constructor(props = {}, subscribers = []) {
        this.state = this.filter(props || {});
        this.subscribers = subscribers || [];
    }

    filter(state) {
        // Add defaults
        state = _.extend({}, {
            title: 'Simplified',
            description: 'Making life easier.',
            language: 'en',
            logo: '/logo.png'
        });

        return state;
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
}

module.exports = function(pathname) {
    return new State(routes[pathname] || {});
};