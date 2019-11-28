import State from '../core/state';
import Screen from '../core/screen';

class CurrentUserState extends State {
    constructor() {
        super();

        this.ready = false;

        // Listen to screen change
        Screen.subscribe(this.onScreenChanged.bind(this));
    }

    onScreenChanged(screen) {

    }
}

const CurrentUser = new CurrentUserState();

export default CurrentUser;