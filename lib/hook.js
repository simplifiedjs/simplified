'use strict';

class AppEvent {
    constructor() {
        this.subscribers = {};
    }

    on( event, callback ) {}

    off( event, callback ) {}

    subscribe(event) {}
}

module.exports = () => new AppEvent();