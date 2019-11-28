import _ from 'underscore';
import State from './state';
import {getRoute, setRoute} from "./route";
import {getRequest} from "./request";
import CurrentUser from '../user/current';

class ScreenState extends State {
    constructor() {
        super();

        this.ready = false;
    }

    isReady() {
        return !!this.ready;
    }

    addScreen(path, props) {
        return setRoute(path, props);
    }

    load(path, refresh = false) {
        const curPath = this.get('path');

        if (curPath === path && !refresh) {
            return; // Do nothing
        }

        let route = getRoute(path);

        if (!route) {
            // Get 404
            route = getRoute('404');
        }

        if (!route) {
            return; // todo: Do something, perhaps load a default 404 page
        }

        if (this.isReady() && ! this.shouldFetch(route)) {
            return;
        }

        getRequest(path).then( r => this.updateScreen(r, route, path));
    }

    shouldFetch(route) {
        if (route.requireLogin && !CurrentUser.isLogin()) {

        }

        if (route.permission) {}

        return true;
    }

    updateScreen(res, route, path) {
        let {state} = res;
        state = state || {};

        state.params = route.params;
        state.path = path;

        let routeState = route.state || {};

        if ('function' === typeof routeState) {
            routeState = routeState.call(null, route.params, state);
        }

        _.extend(state, routeState);

        this.reset(state);
    }
}

const Screen = new ScreenState();

export default Screen;