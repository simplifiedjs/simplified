'use strict';

/* global Collection */

module.exports = {
    login({userId}) {
        return Collection.UserLog.Model.insert({userId: userId, status: 'in'});
    },

    logout: ({key}) => Collection.UserLog.Model.update({status: 'out'}, {key}),

    get({key}) {
        return Collection.UserLog.Model.getRow( false, {key});
    }
};