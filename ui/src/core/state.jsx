import _ from 'underscore';

export default class State {
    constructor(initialState = {}, subscribers = []) {
        this.state = this.filter(initialState);
        this.subscribers = subscribers;
    }

    filter(state) {
        return state;
    }

    get(name) {
        if (name) {
            return this.state[name];
        }

        return this.state;
    }

    set(name, value, isSilent = false) {
        let state = this.state;

        if (_.isObject(name)) {
            state = _.extend({}, state, name);
        } else {
            state[name] = value;
        }

        this.state = this.filter(state);

        if (isSilent) {
            return;
        }

        // Call subscribers here
        this.__subscribe();
    }

    unset(name, value = null, isSilent = false) {
        if (!this.state[name]) {
            return;
        }

        if (!value) {
            this.state = _.omit(this.state, name);

            return;
        }

        let stateValue = this.state[name];

        if (_.isArray(stateValue)) {
            stateValue = _.without(stateValue, value);

            this.state[name] = stateValue;
        }

        if (isSilent) {
            return;
        }

        // Call subscribers
        this.__subscribe();
    }

    reset(state, isSilent = false) {
        this.state = this.filter(state);

        if (isSilent) {
            return;
        }

        this.__subscribe();
    }

    __subscribe() {
        if (!this.subscribers || !this.subscribers.length) {
            return;
        }

        this.subscribers.map( s => s.call(null, this.state));
    }

    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }

    unsubscribe(subscriber) {
        if (!this.subscribers || !this.subscribers.length) {
            return;
        }

        this.subscribers = _.without(this.subscribers, subscriber);
    }

    getKeys() {
        return _.keys(this.state);
    }

    getValues() {
        return _.values(this.state);
    }

    count() {
        return this.getKeys().length;
    }

    /**
     * Get the next property
     *
     * @param {string} name
     */
    nextOf(name) {
        name = new String(name);

        let keys = this.getKeys(),
            index = _.findIndex(keys, name);

        if (index < 0 || !keys[index+1]) {
            return null;
        }

        return this.get(keys[index+1]);
    }

    /**
     * Get the previous property.
     *
     * @param {string} name
     */
    prevOf(name) {
        name = new String(name);

        let keys = this.getKeys(),
            index = _.findIndex(keys, name);

        if (index <= 0 || !keys[index-1]) {
            return null;
        }

        return this.get(keys[index-1]);
    }

    /**
     * Returns the an state object. Removing any other instance of state.
     *
     * @returns {object}
     */
    toJSON() {
        const json = obj => {
            obj = _.clone(obj);

            Object.keys(obj).map( key => {
                let value = obj[key];

                // If a value is an `state` object, get the state only
                if (value && value.subscribe) {
                    value = value.toJSON();
                }

                obj[key] = value;
            });

            return obj;
        };

        return json(this.state);
    }
}