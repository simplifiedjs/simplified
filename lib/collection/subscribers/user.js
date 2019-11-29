'use strict';

const _ = require('lodash'),
    userGroupModel = Collection.UserGroup.Model,
    userModel = Collection.User.Model,
    userMetaModel = Collection.UserMeta.Model,
    userLogModel = Collection.UserLog.Model;

userModel.subscribe( 'insert',
    /**
     * Transform returns into a user data object.
     *
     * @callback
     * @async
     *
     * @param results
     * @returns {Promise<*>}
     */
    async function(results) {
        if (_.isArray(results)) {
            return await results.map( async ID => {
                return await userModel.getRow(false, {ID});
            });
        }

        return userModel.getRow(false, {ID: results});
    });

userGroupModel.subscribe( 'delete',
    /**
     * Move users to a different group whenever a user-group is remove from the database.
     *
     * @param userGroup
     * @returns {Promise<void>}
     */
    async function(userGroup) {
        let [, users] = Collection.User.Model.select({group: userGroup.ID});

        if (users.length) {
            for (let i = 0; i < users.length; i++) {
                await Collection.User.Model.update({
                    ID: users[i].ID,
                    group: 0
                });
            }
        }
    });

userModel.subscribe( 'delete',
    /**
     * Remove user's data when deleted.
     *
     * @param results
     * @param userData
     */
    function(results, userData) {
        userData = _.isArray(userData) ? userData : [userData];

        userData.map( user => {
            // Remove metadata
            userMetaModel.delete({ID: user.ID});

            // Remove log entries
            userLogModel.delete({userId: user.ID});
        });
    });