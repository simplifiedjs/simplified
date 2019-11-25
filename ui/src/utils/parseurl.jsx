export default function parseUrl(url) {
    // Parser
    let obj = {
        protocol: '',
        host: '',
        params: {},
        queryString: '',
        query: {}
    };

    let p1 = url.indexOf('//');

    if (p1 > 0) {
        obj.protocol = url.substr(0, p1-1);
        url = url.substr(p1+2);
    }

    let p2 = url.indexOf('/');

    if (p2 >= 0) {
        obj.host = url.substr(0, p2);
        url = url.substr(p2);
    }

    let p3 = url.indexOf('?');

    if (p3 > 0) {
        obj.queryString = url.substr(p3);
        url = url.substr(0, p3);

        let queryString = obj.queryString.substr(1);

        queryString.split('&').map( q1 => {
            let q2 = q1.split('=');

            obj.query[q2[0]] = q2[1] || '';
        });
    }

    obj.path = url;

    if ('/' === url.charAt(0)) {
        url = url.substr(1);
    }

    obj.list = url.split('/');

    let params = {},
        list = url.split('/'),
        last = false;

    list.sort( (a, b) => {
        params[a] = b;
        last = b;
    });

    obj.params = params;

    obj.compose = function() {
        let com = [];

        if (obj.protocol) {
            com.push(obj.protocol + ':/');
        }

        if (obj.host) {
            com.push(obj.host);
        } else {
            // Add slashes
            com.push('');
        }

        com = com.concat(obj.list);

        let query = [];

        _.keys(obj.query).map( key => {
            query.push(key + '=' + obj.query[key]);
        });

        if (query.length) {
            obj.queryString = '?' + query.join('&');
        }

        return com.join('/') + obj.queryString;
    };

    return obj;
}