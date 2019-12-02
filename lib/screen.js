'use strict';

const _ = require('lodash');

class Screen {
    constructor(state = {}) {
        this.state = state;
        this.subscribers = [];
    }

    get(name = null) {
        if (!name) {
            // Returns the whole state
            return this.state;
        }

        return this.state[name];
    }

    set(name, value = null, isSilent = false) {
        let oldState = _.clone(this.state);

        if (_.isObject(name)) {
            _.extend( this.state, name );
        } else {
            this.state[name] = value;
        }

        if (isSilent) {
            return;
        }

        this.__subscribe(oldState);
    }

    subscribe(callback) {
        if (!callback.name || _.indexOf(this.subscribers, callback.name) >= 0) {
            // Don't allow
            return;
        }

        this.subscribers.push(callback);
    }

    async __subscribe(oldState) {
        //this.subscribers.map( c => c.call(null, this.state, oldState) );
    }
}

module.exports = Screen;