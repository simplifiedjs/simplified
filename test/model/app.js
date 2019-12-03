'use strict';

/* global createCollectionModel, dropCollectionModel, Simplified */

const {assert} = require('chai'),
    _ = require('lodash'),
    schema = require('../../lib/collection/app/schema');

describe('AppSetting Collection Model', function() {

    it('Should create collection model.', async function() {
        let [err] = await createCollectionModel( 'AppSetting', schema );

        return _.isNull(err);
    });

    const appSetting = Simplified.Collection.AppSetting;

    it('Should insert application settings.', async function() {
        // Insert as single setting
        let [err] = await appSetting.set({name: 'test 1', value: true});

        assert.isNull(err);

        // Insert as multiple settings
        let [err2] = await appSetting.set({settings: [
                {name: 'version', value: '1.0.0', autoload: true},
                {name: 'name', value: 'Simplified JS', autoload: true},
                {name: 'apps', value: [1, 2, 3], autoload: false}
            ]});

        assert.isNull(err2);
    });

    it('Should get the application settings.', async function() {
        let [err, settings] = await appSetting.get({autoload: false});

        assert.isNull(err);
        assert.isObject(settings);
        assert.isTrue(!_.isEmpty(settings));
    });

    it('Should remove a single setting.', async function() {
        let [err] = await appSetting.remove({name: 'version'});

        assert.isNull(err);
    });

    it('Should remove collection model.', async function() {
        let [err] = await dropCollectionModel( 'AppSetting' );

        assert.isNull(err);
    });
});