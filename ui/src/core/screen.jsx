import State from './state';
import {getRoute, setRoute} from "./route";
import {getRequest} from "./request";

const Config = new State();

class ScreenState extends State {
    constructor() {
        super();
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

        getRequest(path).then( r => this.updateScreen(r, route, path));
    }

    updateScreen(res, route, path) {
        let {state} = res;
        state = state || {};

        state.params = route.params;
        state.path = path;

        if (route.state) {
            let routeState = route.state;

            if ('function' === typeof routeState) {
                routeState = route.state.call(null, route.params, state);
            }

            _.extend(state, routeState);
        }

        this.reset(state);
    }
}

const Screen = () => new ScreenState();

export default Screen;