'use strict';

module.exports = Admin;

function Admin(app) {
    // Apply admin middleware
    app.use(__autoload, __authenticate, __xhr);

    // Serve admin html
    app.get('*', __html);
}

function __autoload(req, res, next) {

    next();
}

function __authenticate(req, res, next) {
    next();
}

/**
 * Handles all XMLHttpRequest.
 *
 * @callback
 *
 * @param req
 * @param res
 * @param next
 * @private
 */
function __xhr(req, res, next) {
    if (!req.xhr) {
        return next();
    }
}

function __html(req, res) {
    let {lang, title} = global.State.get();

    let body = '<img src="/logo.png"/>';

    const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
</head>
<body>
    <div id="root">${body}</div>
</body>
</html>`;

    res.send(html);
}