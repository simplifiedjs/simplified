'use strict';

/* global Simplified */

const {assert} = require('chai'),
    _ = require('lodash'),
    schema = require('../../lib/collection/user/group-schema');

describe('User Group Model', function() {
    it('Should create new collection in the database.', async function() {
        let [err] = await createCollectionModel( 'UserGroup', schema);

        return _.isNull(err);
    });

    const groupModel = Simplified.Collection.UserGroup;

    let groupId;

    it('Should insert new user group and returns a new object', async function() {
        let [err, group] = await groupModel.set({name: 'Administrator'});

        if (err) {
            return false;
        }

        assert.isObject(group);
        assert.isTrue(group.ID > 0);
        assert.isArray(group.roles);

        groupId = group.ID;
    });

    it('Should remove user group from the database.', async function() {
        let [err] = await groupModel.remove({ID: groupId});

        return _.isNull(err);
    });

    it('Should remove the collection from the database.', async function() {
        let [err] = await dropCollectionModel( 'UserGroup' );

        return _.isNull(err);
    });
});