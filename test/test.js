'use strict';

const _ = require('lodash');

function b({login, email, group}) {
    let a = _.omitBy({login, email, group}, _.isUndefined);

    console.log(a);
}

b({login: 'irene'});
