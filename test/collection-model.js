'use strict';

const _ = require('lodash');

describe('Collection Model', function() {
    it('Should create new collection model.', async function() {
        let [err] = await createCollectionModel( 'test_user', {
            ID: {
                type: 'Id'
            },
            group: {
                type: 'ForeignId',
                required: true
            },
            test2: {
                type: 'Object'
            }
        });

        return _.isNull(err);
    });

    it('Should alter collection model structure.', async function() {
        let [err] = await alterCollectionModel( 'test_user',
            {
                login: {
                    type: 'String',
                    required: true,
                    unique: true,
                    index: true
                }
            },
            {
                group: {
                    type: 'Int'
                }
            },
            ['test2']);

        return _.isNull(err) || _.isEmpty(err);
    });

    it('Should copy collection model', async function() {
        let [err] = await cloneCollectionModel( 'test_user', 'test_user_2' );

        return _.isNull(err);
    });

    it('Should remove collection model.', async function() {
        let [err] = await dropCollectionModel( 'test_user' );

        if (err) {
            return false;
        }

        let [err2] = await dropCollectionModel( 'test_user_2' );

        return _.isNull(err2);
    });
});