'use strict';

/* global Simplified */

const _ = require('lodash'),
    adminScreen = Simplified.adminScreen,
    adminApp = Simplified.adminApp;

module.exports = admin;

async function admin(req, res, next) {
    // Reset admin screen
    adminScreen.reset();

    // Load admin files
    require('../screen/admin/dashboard')();
    require('../screen/admin/users')();

    // Iterate admin routes
    _.keys(adminScreen.routes).map( route => adminApp.get(route, xhr, html));

    // Add error listener
    adminApp.get('*', xhr, html);

    // Trigger admin event
    await Simplified.Event.trigger( 'adminInit' );

    next();
}

async function xhr(req, res, next) {
    if (!req.xhr) {
        await adminScreen.render(req.route.path, req.params);

        return next();
    }

    let state = await adminScreen.render(req.route.path, req.params);
    res.send(state);
}

function html(req, res) {
    let {title, description} = Simplified.adminScreen.get(),
        lang = 'en';

    let body = '<img src="/logo.png"/>';

    let time = new Date().getTime();

    const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="description" content="${description}"/>
</head>
<body>
    <div id="root">${body}</div>
    <script type="text/javascript" src="/js/common-bundle.js?v=${time}"></script>
    <script type="text/javascript" src="/js/dom.js?v=${time}"></script>
</body>
</html>`;

    res.send(html);
}