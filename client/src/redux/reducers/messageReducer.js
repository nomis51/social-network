import { FETCH_MESSAGES, NEW_MESSAGE } from '../actions/types';

const initialState = {
    items: [],
    item: {}
};

export default function (state = initialState, action) {
    switch (action) {
        case FETCH_MESSAGES:
            return {
                ...state,
                items: action.payload
            };

        case NEW_MESSAGE:
            return {
                ...state,
                item: action.payload
            };

        default:
            return state;
    }
}