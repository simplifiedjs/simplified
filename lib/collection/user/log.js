'use strict';

/* global Simplified */

const Collection = Simplified.Collection;

Collection.add( 'UserLog', require('./log-schema'), require('./log-methods'));