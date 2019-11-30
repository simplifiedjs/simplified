'use strict';

const _ = require('lodash'),
    schema = require('../../lib/collection/schema/app'),
    methods = require('../../lib/collection/methods/app');

describe('AppSetting Collection Model', function() {
    it('Should create collection model.', async function() {
        let [err] = await createCollectionModel( 'AppSetting', schema );

        return _.isNull(err);
    });

    Collection.add( 'AppSetting', schema, methods );

    const appSetting = Collection.AppSetting;

    it('Should insert application settings.', async function() {
        // Insert as single setting
        let [err] = await appSetting.set({name: 'test 1', value: true});

        if (err) {
            return false;
        }

        // Insert as multiple settings
        let [err2] = await appSetting.set({settings: [
                {name: 'version', value: '1.0.0', autoload: true},
                {name: 'name', value: 'Simplified JS', autoload: true},
                {name: 'apps', value: [1, 2, 3], autoload: false}
            ]});

        return _.isNull(err2);
    });

    it('Should get the application settings.', async function() {
        let [err, settings] = await appSetting.get({autoload: false});

        return _.isNull(err) && _.isObject(settings);
    });

    it('Should remove collection model.', async function() {
        let [err] = await dropCollectionModel( 'AppSetting' );

        return _.isNull(err);
    });
});