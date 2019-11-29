'use strict';

const _ = require('lodash');

describe('Collection Model', function() {
    it('Should new collection model.', async function() {
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

        if (err) {
            console.log(err.message);
        }

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

    it('Should remove collection model', async function() {
        let [err] = await dropCollectionModel( 'test_user' );

        if (err) {
            console.log(err.message);
        }

        return _.isNull(err);
    });
});