import State from './state';
import _ from 'underscore';
import {pathToRegexp} from "path-to-regexp";
import {parseUrl} from '../utils';

const Routes = new State();

function findRoute(routePath) {
    let route;

    Routes.getKeys().map( routePath => {
        const keys = [],
            regex = pathToRegexp(routePath, keys),
            params = {},
            arr = regex.exec(path);

        if (arr) {
            route = _.extend({}, routes[path]);

            // Remove the first item on the array
            arr.shift();

            keys.map( (param, i) => {
                if (param.name) {
                    params[param.name] = arr[i];
                }
            });

            route.params = params;
        }
    });

    return route;
}

export function getRoute(path) {
    const routes = Routes.get();
    let route = routes[path];

    if (!route) {
        route = findRoute(path);
    }

    return route;
}

/**
 *
 * @param {string} path
 * @param {object} props
 * @param {object|function} props.state
 * @param {boolean} replace
 */
export function setRoute(path, props, replace = true) {
    if (!replace && Routes.get(path)) {
        return;
    }

    let url = parseUrl(path),
        data = _.extend({}, props);

    data.query = url.query;

    Routes.set(path, data);
}