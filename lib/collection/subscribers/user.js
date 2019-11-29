'use strict';

Collection.UserGroup.Model.subscribe( 'delete',
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

Collection.User.Model.subscribe( 'delete',
    /**
     * Remove user's metadata whenever user is remove from the database.
     *
     * @param {object|array} user
     */
    function(user) {
        //Collection.UserMeta.Model.delete({userId: user.ID});
    });