'use strict';

/* global Simplified */

const _ = require('lodash'),
    Collection = Simplified.Collection;

Collection.add( 'AppSetting', require('./schema'), require('./methods'));

Collection.AppSetting.on( 'get',
    /**
     * Transform an array into an object.
     *
     * @param {object|array<object>} settings
     * @returns {object}
     */
    function(settings) {
        if (!settings || !_.isArray(settings)) {
            return settings;
        }

        let _settings = {};

        settings.map( setting => {
            _settings[setting.name] = setting.value;
        });

        return _settings;
    });