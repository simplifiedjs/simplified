'use strict';

const {define} = require('./utils'),
    _ = require('lodash'),
    Screen = require('./screen');

module.exports = bootstrap;

function bootstrap(config) {
    const {absPath, publicPath, uploadPath, database} = config;
    define( 'ABSPATH', absPath );
    define('UPLOAD_PATH', uploadPath );
    define('PUBLIC_PATH', publicPath );

    // Load files
    require('./utils');
    require('./collection')(database);

    // Load screens
    const appSettings = _.pick(config, ['name', 'tagline', 'logo', 'favIcon']);
    define( 'Screen', new Screen({appSettings}) );
    define( 'AdminScreen', new Screen({appSettings}) );

    // Load collection models
    Collection.add( 'AppSetting', require('./collection/schema/app') );
    Collection.add( 'User', require('./collection/schema/user'), require('./collection/methods/user') );
    Collection.add( 'UserGroup', require('./collection/schema/user-group'));
    Collection.add( 'UserLog', require('./collection/schema/user-log') );
    Collection.add( 'UserMeta', require('./collection/schema/user-meta') );

    // Set subscribers
    require('./collection/subscribers/app');
    require('./collection/subscribers/user');
}