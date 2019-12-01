'use strict';

/* global define, Collection */

const _ = require('lodash'),
    Screen = require('./screen');

module.exports = bootstrap;

function bootstrap(config) {
    require('./utils');

    const {absPath, publicPath, uploadPath, database} = config;

    define( 'ABSPATH', absPath );
    define('UPLOAD_PATH', uploadPath );
    define('PUBLIC_PATH', publicPath );

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

    // Load collection models
    Collection.add( 'AppSetting', require('./collection/schema/app'), require('./collection/methods/app') );
    Collection.add( 'User', require('./collection/schema/user'), require('./collection/methods/user') );
    Collection.add( 'UserGroup', require('./collection/schema/user-group'), require('./collection/methods/user-group'));
    Collection.add( 'UserLog', require('./collection/schema/user-log'), require('./collection/methods/user-log') );
    Collection.add( 'UserMeta', require('./collection/schema/user-meta'), require('./collection/methods/user-meta') );

    // Set subscribers
    //require('./collection/subscribers/global');
    require('./collection/subscribers/app');
    require('./collection/subscribers/user');
}