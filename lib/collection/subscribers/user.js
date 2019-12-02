'use strict';

/*global Collection, nodeMailer */

const _ = require('lodash'),
    userGroupModel = Collection.UserGroup,
    userModel = Collection.User,
    userMetaModel = Collection.UserMeta,
    userLogModel = Collection.UserLog;

userModel.on( 'insert',
    /**
     * Sends the welcome email to newly registered user.
     *
     * @param {object} user
     */
    function(user) {
        nodeMailer.trigger( 'newUser', user.email );
    });

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
     * Remove user's data when deleted but keep the system running.
     *
     * @param {object} user
     */
    function(user) {
        // Remove meta-data

        // Remove user's log
    });