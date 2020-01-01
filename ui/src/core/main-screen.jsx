import State from './state';
import Screen from './screen';

class MainScreen extends State {
    constructor() {
        super();

        this.isReady = false;
    }

    setConfig(config) {}

    load(path, isRefresh = false) {

    }
}