'use strict';

/* global define, Collection */

module.exports = bootstrap;

function bootstrap() {
    require('./utils');
    require('./event');

    // Get screens
    require('./screen/admin');

    /**

    // Load screens and it's defaults
    const appSettings = _.pick(config, ['name', 'tagline', 'logo', 'favIcon']),
        title = appSettings.name,
        description = appSettings.tagline,
        isAdmin = true;
    define( 'Screen', new Screen({appSettings, title, description}) );
    define( 'AdminScreen', new Screen({appSettings, title, description, isAdmin}) );


    // Collection models
    define( 'Collection', {} );
    define( '__config', database, Collection );

    require('./collection');
    require('./mailer')(mailer);

    // Load collection models
    Collection.add( 'AppSetting', require('./collection/schema/app'), require('./collection/methods/app') );
    Collection.add( 'User', require('./collection/schema/user'), require('./collection/methods/user') );
    Collection.add( 'UserGroup', require('./collection/schema/user-group'), require('./collection/methods/user-group'));
    Collection.add( 'UserLog', require('./collection/schema/user-log'), require('./collection/methods/user-log') );
    Collection.add( 'UserMeta', require('./collection/schema/user-meta'), require('./collection/methods/user-meta') );
    Collection.add( 'Mail', require('./collection/schema/mail'), require('./collection/methods/mail'));

    // Set subscribers
    //require('./collection/subscribers/global');
    require('./collection/subscribers/app');
    require('./collection/subscribers/user');
     **/
}