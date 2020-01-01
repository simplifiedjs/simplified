'use strict';

/* global define, Simplified */

module.exports = bootstrap;

function bootstrap() {
    require('./utils');

    // Load collections
    require('./collection');
    require('./collection/app');
    require('./collection/user');
    require('./collection/user/log');
    require('./collection/user/group');
    require('./collection/user/meta');
    require('./collection/mail');
}