import State from './state';
import _ from 'underscore';
import pathRegex from "path-to-regexp";
import {parseUrl} from '../utils';

const Routes = new State();

export function getRoute(path) {
    const routes = Routes.get();

    if (routes[path]) {
        return _.extend({}, routes[path], {params: {}});
    }

    let route;

    Routes.getKeys().map( routePath => {
        const {regex, keys} = routes[routePath];
        let params = {},
            arr = regex.exec(path);

        if (arr) {
            route = routes[path];

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

    let keys = [],
        regex = pathRegex(path, keys),
        data = {regex, keys, props},
        url = parseUrl(path);

    data.query = url.query;

    Routes.set(path, data);
}

