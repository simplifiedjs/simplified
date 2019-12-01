'use strict';

const {assert} = require('chai'),
    _ = require('lodash'),
    schema = require('../../lib/collection/schema/user-log');

describe( 'User Log Collection Model', function() {
    it('Should create collection in the database.', async function() {
        let [err] = await createCollectionModel('UserLog', schema);

        assert.isNull(err);
    });

    const userLog = Collection.UserLog;
    let logKey;

    it('It should insert new log data in the database.', async function() {
        let [err, key] = await userLog.login({userId: 1});

        assert.isNull(err);
        logKey = key;
    });

    it('Should get log data.', async function() {
        let [err, log] = await userLog.get({key: logKey});

        assert.isNull(err);
        assert.isObject(log);
    });

    it('Should update log date when user logs out.', async function() {
        let [err] = await userLog.logout({key: logKey});

        assert.isNull(err);
    });

    it('Should remove collection from the database.', async function() {
        let [err] = await dropCollectionModel( 'UserLog' );

        assert.isNull(err);
    });
});