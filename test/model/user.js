'use strict';

/* global Simplified */

const {assert} = require('chai'),
    _ = require('lodash'),
    userSchema = require('../../lib/collection/user/schema'),
    Collection = Simplified.Collection;

describe('User Model', function() {
    it('Should create collection in the database.', async function() {
        let [err] = await createCollectionModel( 'User', userSchema );

        return _.isNull(err);
    });

    const userModel = Collection.User;

    let newUser = {};

    it('Should add new user.', async function() {
        let [err, user] = await userModel.insert({
            login: 'irene',
            email: 'irene@local.net',
            pass: 12345,
            group: 1
        });

        assert.isNull(err);
        assert.isObject(user);
        newUser = user;
    });

    it('Should update user\'s email.', async function() {
        let [err, user] = await userModel.update({ID: newUser.ID, email: 'irene2@local.net'});

        assert.isNull(err);
        assert.isObject(user);

        // Check all are as is except email
        user.email = 'irene@local.net';
        assert.isTrue(_.isEqual(user, newUser));
    });

    it('Should get user from the database.', async function() {
        // Get via ID
        let [err, user] = await userModel.get({ID: newUser.ID});

        assert.isNull(err);
        assert.isObject(user);

        // Get via email address
        let [err2, user2] = await userModel.getBy({column: 'email', value: 'irene2@local.net'});

        assert.isNull(err2);
        assert.isObject(user2);

        // Get all users
        let [err3, users] = await userModel.query({});
        assert.isNull(err3);
        assert.isArray(users);
    });

    it('Should delete user from the database.', async function() {
        let [err] = await userModel.delete({ID: newUser.ID});

        assert.isNull(err);

        let [err2] = await userModel.get({ID: newUser.ID});

        assert.isTrue(_.isError(err2));
    });

    it('Should remove collection from the database.', async function() {
        let [err] = await dropCollectionModel('User');

        assert.isNull(err);
    });
});