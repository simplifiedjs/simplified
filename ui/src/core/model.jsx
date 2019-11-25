import State from './state';
import {postRequest} from "./request";

export default class StateModel extends State {
    constructor(name, initialState = {}, subscribers = []) {
        super(initialState, subscribers);

        this.modelName = name;
    }

    postFilteredState() {
        let state = this.toJSON();

        return state;
    }

    getModel() {}
}