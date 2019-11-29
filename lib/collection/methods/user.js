'use strict';

module.exports = {
    async insert(user) {
        let model = Collection.User.Model,
            userData = await model.insert(user);

        if (!userData) {
            // Return error
            return [setError(null, 'userInsertError')];
        }

        return userData;
    },

    async update(user) {
        let model = Collection.User.Model,
            userId = await model.update(user);

        if (!userId) {
            return [setError(null, 'userUpdateError')];
        }

        return model.getRow(false, {ID: userId});
    },

    async delete({ID}) {
        let model = Collection.User.Model,
            done = await model.delete({ID: ID});

        if (!done) {
            return [setError(null, 'userDeleteError')];
        }

        return [null, true];
    },

    async get({ID}) {
        let model = Collection.User.Model,
            user = await model.getRow(false, {ID: ID});

        if (!user) {
            return [setError(null, 'userNotExist')];
        }

        return [null, user];
    },

    async getBy({column, value}) {
        let model = Collection.User.Model,
            user = await model.getRow(false, _.zipObject([column], [value]));

        if (!user) {
            return [setError(null, 'userNotExist')];
        }

        return [null, user];
    },

    async login({login, pass}) {
        let column = isEmail(login) ? 'email' : 'login',
            [err, user] = Collection.User.getBy({column: column, value: login});

        if (err) {
            return [setError(null, 'invalidLogin')];
        }

        // Validate pass
        let origPass = await decryptHashKey(user.pass);

        if (!_.isEqual(origPass, pass)) {
            return [setError(null, 'invalidLogin')];
        }

        let logKey = await Collection.UserLog.Model.insert({userId: user.ID}),
            hashKey = await generatePasswordHash(logKey);

        // todo: Save in cookie

        return [null, user];
    },

    async logout({key, hashKey}) {
        const logModel = Collection.UserLog.Model,
            dateOut = Collection.DateTime();

        if (hashKey) {
            // Logging out current user
            key = await decryptHashKey(hashKey);

            if (isError(key)) {
                return [setError(null, 'systemError')];
            }
        }

        // Logout user by key
        await logModel.update({dateOut}, {key: key});

        if (logModel.lastError) {
            return [setError(null, 'systemError')];
        }

        return [null, true];
    }
};