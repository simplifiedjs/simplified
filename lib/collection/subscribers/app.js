'use strict';

const _ = require('lodash'),
    appSubscribe = Collection.AppSetting.Model.subscribe;

appSubscribe( 'get',
    /**
     * Transform an array of results into an object.
     *
     * @param settings
     * @returns {*}
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

appSubscribe( 'insert', setAppSettings );
appSubscribe( 'update', setAppSettings );

async function setAppSettings() {
    // Get autoload settings
    let settings = await Collection.AppSetting.get({autoload: true});
}