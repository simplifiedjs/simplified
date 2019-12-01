'use strict';

const _ = require('lodash');

module.exports = {
    /**
     * @async
     * @param {object} user
     * @returns {Array<Object>}
     */
    async insert({login, email, pass, group, meta}) {
        const model = Collection.User.Model,
            [err, ID] = await model.insert({login, email, pass, group});

        if (err) {
            return [err];
        }

        // todo: Add user meta

        return Collection.User.get({ID});
    },

    /**
     *
     * @param ID
     * @param login
     * @param email
     * @param pass
     * @param group
     * @param {object} meta
     * @returns {Promise<*>}
     */
    async update({ID, login, email, pass, group, meta}) {
        if (!ID) {
            return [errorCode('invalidUserId')];
        }

        let model = Collection.User.Model,
            userData = _.omitBy({ID, login, email, pass, group}, _.isUndefined);

        if (login || email || pass || group) {
            let [err] = await model.update(userData, {ID});

            if (err) {
                return [err];
            }
        }

        return Collection.User.get({ID});
    },

    async delete({ID}) {
        const [err, user] = await Collection.User.get({ID});

        if (err) {
            return [err];
        }

        const [err2] = await Collection.User.Model.delete({ID});

        if (err2) {
            return [err2];
        }

        // Call user deletion subscribers
        await Collection.User.trigger( 'delete', user );

        return [null, true];
    },

    async getBy({column, value}) {
        let where = _.zipObject([column], [value]),
            [err, user] = await Collection.User.Model.getRow( false, where);

        if (err || _.isUndefined(user)) {
            return [errorCode('userNotExist')];
        }

        user = await Collection.User.trigger( 'get', user );

        return [null, user];
    },

    get({ID}) {
        return Collection.User.getBy({column: 'ID', value: ID});
    },

    async query({group, page, perPage}) {
        perPage = perPage || 50;

        let where = {};

        if (group) {
            where.group = _.isArray(group) ? {$in: group} : group;
        }

        let [err, users] = await Collection.User.Model.get({where});

        if (err || !users) {
            return [err, users||[]];
        }

        let userList = [];
        await awaitAll( users, async user => {
            user = await Collection.User.trigger( 'get', user );

            userList.push(user);
        });

        return [null, userList];
    },

    async login({login, pass}) {
        let column = isEmail(login) ? 'email' : 'login',
            [err, user] = await Collection.User.getBy({column: column, value: login});

        if (err) {
            return [err];
        }

        // Validate password
        let [err2, hash] = await decryptHashKey(user.pass);

        if (err2) {
            return [err2];
        }

        if (!_.isEqual(hash, pass)) {
            return [errorCode('incorrectLogin')];
        }

        return [null, user];
    },

    async logout({key, hashKey}) {
        const logModel = Collection.UserLog.Model,
            dateOut = Collection.DateTime();

        if (hashKey) {
            // Logging out current user
            let [err, key] = await decryptHashKey(hashKey);
        }

        // Logout user by key
        await logModel.update({dateOut}, {key: key});

        if (logModel.lastError) {
            return [setError(null, 'systemError')];
        }

        return [null, true];
    }
};