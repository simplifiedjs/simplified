'use strict';

/* global Simplified */
const Collection = Simplified.Collection;

Collection.add( 'Mailer', require('./schema'), require('./methods'), require('./event') );

define( 'Event', require('./event')(), Collection.Mailer );

// Clear mail event subscribers
Simplified.on( 'init', Collection.Mailer.Event.reset );