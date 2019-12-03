'use strict';

/* global Simplified */

const _ = require('lodash'),
    Collection = Simplified.Collection;

Collection.add( 'User', require('./schema'), require('./methods'));