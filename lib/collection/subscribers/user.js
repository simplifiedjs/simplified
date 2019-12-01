'use strict';

const _ = require('lodash'),
    userGroupModel = Collection.UserGroup,
    userModel = Collection.User,
    userMetaModel = Collection.UserMeta,
    userLogModel = Collection.UserLog;

userGroupModel.on( 'delete',
    /**
     * Move users to a different group whenever a user group is remove from the database.
     *
     * @param userGroup
     * @returns {Promise<void>}
     */
    async function(userGroup) {
        let [, users] = await userModel.Model.get({where: {group: userGroup}});

        if (users && users.length) {
            for (let i = 0; i < users.length; i++) {
                await userModel.update({
                    ID: users[i].ID,
                    group: 0 // Get `others` group
                });
            }
        }
    });

userModel.on( 'delete',
    /**
     * Remove user's data when deleted.
     *
     * @param {object} user
     */
    async function(user) {
        // Remove meta-data

        // Remove user's log
    });