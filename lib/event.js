'use strict';

const _ = require('lodash');

/* global Simplified */

class SimplifiedEvent {
    constructor() {
        this.subscribers = {};
        this.reset = this.reset.bind(this);
    }

    reset() {
        this.subscribers = {};
    }

    on( event, callback ) {
        if (!callback.name) {
            return; // Don't accept hook callback
        }

        let subscribers = this.subscribers[event] || [],
            index = _.findIndex(subscribers, callback);

        if (index >= 0) {
            return; // Don't add the same subscribers
        }

        subscribers.push(callback);

        this.subscribers[event] = subscribers;
    }

    off(event, callback) {
        let subscribers = this.subscribers[event];

        if (!subscribers.length || !callback.name) {
            return;
        }

        let index = _.findIndex(subscribers, callback.name);

        if (index < 0) {
            return;
        }

        subscribers = _.without(subscribers, index);

        this.subscribers[event] = subscribers;
    }

    async trigger(event, value) {
        let subscribers = this.subscribers[event];

        if (_.isEmpty(subscribers)) {
            return value;
        }

        let args = _.values(arguments).slice(1);

        await awaitAll(subscribers, async cb => {
            if ('function' !== typeof cb) {
                let index = _.findIndex(subscribers, cb);
                subscribers = _.without(subscribers, index);
                return;
            }

            value = await cb.apply(null, args);
        });

        this.subscribers[event] = subscribers;

        return value;
    }
}

module.exports = () => new SimplifiedEvent();