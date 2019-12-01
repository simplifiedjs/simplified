'use strict';

/* global Collection */

module.exports = {
    login({userId, os}) {
        return Collection.UserLog.Model.insert({userId: userId, status: 'in', os});
    },

    logout: ({key}) => Collection.UserLog.Model.update({status: 'out'}, {key}),

    get({key, userId}) {
        if (userId) {
            return Collection.UserLog.Model.get({where: {userId}});
        }

        return Collection.UserLog.Model.getRow( false, {key});
    }
};