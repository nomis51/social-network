import { LOGIN, LOGOUT } from '../actions/types';

const initialState = {};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                ...action.payload
            };

        case LOGOUT:
            const nextState = {
                ...state
            };
            delete nextState.token;
            return nextState;

        default:
            return state;
    }
}