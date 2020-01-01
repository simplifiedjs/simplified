import _ from 'lodash';
import {pathToRegexp} from "path-to-regexp";

export default function findRoute(path, routeList) {
    let route = null,
        found = false;

    _.forEach(routeList, (component, route) => {
        if (found) {
            return;
        }

        const keys = [],
            regex = pathToRegexp(route, keys),
            params = {},
            arr = regex.exec(path);

        if (arr) {
            // Remove the first item on the array
            arr.shift();

            keys.map( (param, i) => {
                if (param.name) {
                    params[param.name] = arr[i];
                }
            });

            found = true;
            route = {component, params};
        }
    });

    return route;
}