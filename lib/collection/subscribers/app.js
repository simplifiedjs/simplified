'use strict';

const _ = require('lodash'),
    appModel = Collection.AppSetting;

appModel.on( 'get',
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

appModel.on( 'insert', setAppSettings );
appModel.on( 'update', setAppSettings );

async function setAppSettings() {
    // Get autoload settings and load then on screens
    let settings = await Collection.AppSetting.get({autoload: true});

    if (!_.isEmpty(settings)) {
        // Update screens
        const screenSetting = _.extend(Screen.get('appSettings'), settings );
        Screen.set('appSettings', screenSetting);

        const adminSetting = _.extend(AdminScreen.get('appSettings'), settings );
        AdminScreen.set( 'appSettings', adminSetting );
    }
}