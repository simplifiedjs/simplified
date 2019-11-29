'use strict';

module.exports = Admin;

function Admin(app) {
    // Apply admin middleware
    app.use(__autoload, __authenticate);

    // Serve admin html
    app.get('*', __xhr, __html);
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

    const state = AdminScreen.get();

    res.send(state);
}

function __html(req, res) {
    let {title, description} = AdminScreen.get(),
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