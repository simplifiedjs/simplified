'use strict';

/* global Simplified */

const _ = require('lodash'),
    adminScreen = Simplified.AdminScreen,
    adminApp = Simplified.adminApp,
    iterateGet = _.memoize(iterateGetRoutes, generateCachedKey('keys')),
    iteratePost = _.memoize(iteratePostRoutes, generateCachedKey('keys'));

module.exports = admin;

async function admin(req, res, next) {
    // Clear routes
    Simplified.adminGetRoutes = {};
    Simplified.adminPostRoutes = {};

    // Reset admin screen
    adminScreen.reset();

    // Trigger admin init event
    await Simplified.trigger( 'adminInit' );

    // Iterate admin routes
    iterateGet(Simplified.adminGetRoutes);
    //iteratePost(Simplified.adminPostRoutes);

    // Add error listener
    adminApp.get('*', adminScreen.init({
        typeNow: 'not-found',
        title: 'Page Not Found'
    }), xhr, html);

    next();
}

function iterateGetRoutes(routes) {
    _.forEach(routes, route => adminApp.get(route.route, adminScreen.init(route), xhr, html));
}

function iteratePostRoutes(routes) {
    return _.forEach(routes, route => adminApp.post(route.route, adminScreen.init(route), postHandler));
}

async function xhr(req, res, next) {
    if (!req.xhr) {
        await adminScreen.render(req.params);

        return next();
    }

    let state = await adminScreen.render(req.params);
    res.send(state);
}

function postHandler(req, res) {
    let state = adminScreen.render(req.params);

    res.send(state);
}

function html(req, res) {
    let {title, description} = adminScreen.get(),
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
    <script type="text/javascript" src="/js/simplified.js?v=${time}"></script>
    <script type="text/javascript">
    Simplified({
    hash: 'hashKey'
    });
</script>
</body>
</html>`;

    res.send(html);
}