'use strict';

const State = require('../state');

module.exports = [validateDB, validateUser];

function validateDB(req, res, next) {
    global.State = new State(req.path);

    next();
}

function validateUser(req, res, next) {
    next();
}