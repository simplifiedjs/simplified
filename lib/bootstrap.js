'use strict';

const {define} = require('./utils');

module.exports = bootstrap;

function bootstrap({publicPath, uploadPath, database}) {
    define('UPLOAD_PATH', uploadPath );
    define('PUBLIC_PATH', publicPath );

    // Load files
    require('./utils');
    require('./collection')(database);

    // Load collection models
    Collection.add( 'AppSetting', require('./collection/schema/app') );
    Collection.add( 'User', require('./collection/schema/user'), require('./collection/methods/user') );
    Collection.add( 'UserLog', require('./collection/schema/user-log') );
    Collection.add( 'UserMeta', require('./collection/schema/user-meta') );

    // Set subscribers
    require('./subscribers/user-meta');
}