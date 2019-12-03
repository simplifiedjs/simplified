'use strict';

/* global Simplified */

const {assert} = require('chai'),
    _ = require('lodash'),
    schema = require('../../lib/collection/user/meta-schema');

describe('User Meta Collection Model', async function() {
    it('Should create collection in the database.', async function() {
        let [err] = await createCollectionModel( 'UserMeta', schema );

        assert.isNull(err);
    });

    const userMeta = Simplified.Collection.UserMeta;

    it('Should insert user meta.', async function() {
        // Insert a single meta
        let [err] = await userMeta.set({
            userId: 1,
            name: 'cousin',
            value: 'Irene'
        });

        assert.isNull(err);

        // Insert multiple metadata
        let [err2] = await userMeta.set({
            userId: 1,
            autoload: true,
            meta: {
                first_name: 'Irene',
                last_name: 'Mitchell',
                birth: '02/21/79'
            }
        });

        assert.isNull(err2);
    });

    it('Should get user meta data.', async function() {
        // Get single value
        let [err, meta] = await userMeta.get({userId: 1, name: 'cousin'});

        assert.isNull(err);
        assert.isTrue(_.isEqual(meta, 'Irene'));

        // Get multiple meta-data
        let [err2, metas] = await userMeta.get({userId: 1, autoload: true});

        assert.isNull(err2);
        assert.isObject(metas);
    });

    it('Should remove meta from the database.', async function() {
        // Remove a single meta
        let [err] = await userMeta.unset({userId: 1, name: 'cousin'});

        assert.isNull(err);

        let [, meta] = await userMeta.get({userId: 1, name: 'cousin'});
        assert.isTrue(_.isUndefined(meta));

        // Remove all meta
        let [err2] = await userMeta.unset({userId: 1});

        assert.isNull(err2);

        let [, metas] = await userMeta.get({userId: 1});

        assert.isTrue(_.isEmpty(metas));
    });

    it('Should remove collection from the database.', async function() {
        let [err] = await dropCollectionModel( 'UserMeta' );

        assert.isNull(err);
    });
});