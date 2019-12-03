'use strict';

/* global Simplified */

const _ = require('lodash'),
    Collection = Simplified.Collection;

module.exports = {
    async get({userId, name, autoload}) {
        let where = _.omitBy({userId, name, autoload}, _.isUndefined),
            [err, meta] = await Collection.UserMeta.Model.get({where});

        if (err) {
            return [err];
        }

        let metas = {};

        meta.map( _meta => {
            metas[_meta.name] = _meta.value;
        });

        if (name) {
            return [null, metas[name]];
        }

        return [null, metas];
    },

    async set({userId, name, value, autoload, meta}) {
        const model = Collection.UserMeta.Model;

        model.multi();

        if (!meta) {
            meta = [{userId, name, value, autoload}];
        } else {
            let metas = [];

            _.forEach( meta, (val, key) => {
                metas.push({
                    userId: userId,
                    name: key,
                    value: val,
                    autoload: autoload
                });
            });

            meta = metas;
        }

        let hasError = false,
            newMeta = [];

        await awaitAll( meta, async metaData => {
            if (hasError) {
                return;
            }

            let where = {name: metaData.name, userId: userId},
                [err, oldValue] = await model.getRow( false, where);

            if (err) {
                hasError = err;
                return;
            }

            if (oldValue) {
                let [err2] = await model.update(metaData, where);

                if (err2) {
                    hasError = err2;
                }

                return;
            }

            newMeta.push(metaData);
        });

        if (hasError) {
            model.end();

            return [hasError];
        }

        let [err, done] = await model.insert(newMeta);
        model.end();

        return [err, done];
    },

    async unset({userId, name}) {
        let where = {userId},
            model = Collection.UserMeta.Model;

        if (name) {
            where.name = name;
        }

        return model.delete(where);
    }
};