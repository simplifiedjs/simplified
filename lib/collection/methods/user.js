'use strict';

module.exports = {
    insert(user) {
        return Collection.User.Model.insert(user);
    },

    insertMany(users) {
        return Collection.User.Model.insert(users);
    },

    update({ID, login, email, pass, group}) {},

    delete: where => Collection.User.Model.delete(where),

    get({ID}) {},

    getBy({column, value}) {},

    validate({login, pass}) {}
};