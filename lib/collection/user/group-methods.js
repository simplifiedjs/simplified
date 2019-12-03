'use strict';

/* global Simplified */
const Collection = Simplified.Collection;

module.exports = {
    /**
     * Get user group by name or ID.
     *
     * @async
     * @param {string} name
     * @param {int} ID
     * @returns {Array<Object>}
     */
    async get({name, ID}) {
        const model = Collection.UserGroup.Model;

        let where = ID ? {ID} : {name},
            [err, group] = await model.getRow( false, where);

        if (group) {
            group = await Collection.UserGroup.trigger( 'get', group );
        }

        return [err, group];
    },

    /**
     * @async
     * @param {string} name
     * @param {array} roles
     * @returns {Array<Object>}
     */
    async set({name, roles}) {
        const model = Collection.UserGroup.Model;

        model.multi();

        const [err, ID] = await model.insert({name, roles});

        if (err) {
            model.end();
            return [err];
        }

        let [err2, group] = await model.getRow(false, {ID});

        model.end();

        if (group) {
            group = await Collection.UserGroup.trigger( 'get', group );
        }

        return [err2, group];
    },

    async remove({ID}) {
        const [err, done] = await Collection.UserGroup.Model.delete({ID});

        if (done) {
            await Collection.UserGroup.trigger( 'delete', ID );
        }

        return [err, done];
    }
};