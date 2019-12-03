'use strict';

/* global Simplified */

const _ = require('lodash'),
    Collection = Simplified.Collection;

Collection.add( 'UserGroup', require('./group-schema'), require('./group-methods'));