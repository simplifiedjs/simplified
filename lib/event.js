'use strict';

const _ = require('lodash');

/* global Simplified */

class SimplifiedEvent {
    constructor() {
        this.subscribers = {};
    }

    on( event, callback ) {
        let subscribers = this.subscribers[event] || [];

        if (_.findIndex(subscribers, callback.name)) {
            return; // Don't add multiple event with the same callback
        }

        subscribers.push(callback);

        this.subscribers[event] = callback;
    }

    off(event, callback) {
        let subscribers = this.subscribers[event];

        if (!subscribers.length) {
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
            value = await cb.apply(null, args);
        });

        return value;
    }
}

module.exports = () => new SimplifiedEvent();