'use strict';

const _ = require('lodash');

class ModelMethods {
    constructor() {
        this.subscribers = {};

        this.on = this.on.bind(this);
        this.trigger = this.trigger.bind(this);
    }

    on( action, callback ) {
        if ('function' !== typeof callback) {
            return;
        }

        let subscribers = this.subscribers[action] || [];

        subscribers.push(callback);

        this.subscribers[action] = subscribers;
    }

    async trigger(action, value) {
        if (!this.subscribers[action]) {
            return Promise.resolve(value);
        }

        let args = _.values(arguments).slice(1);

        await awaitAll( this.subscribers[action], async cb => {
            if ('function' !== typeof cb) {
                return;
            }

            value = await cb.apply( null, args );
        });

        return value;
    }
}

module.exports = name => new ModelMethods(name);