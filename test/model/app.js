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

    it('Should insert application settings.', async function() {
        let done = await Collection.AppSetting.set({name: 'version', value: '1.0.0', autoload: true});

        return !_.isNull(done);
    });

    it('Should get the application settings', async function() {
        let settings = await Collection.AppSetting.get({autoload: true});

        return !_.isEmpty(settings);
    });

    it('Should remove collection model.', async function() {
        let [err] = await dropCollectionModel( 'AppSetting' );

        return _.isNull(err);
    });
});