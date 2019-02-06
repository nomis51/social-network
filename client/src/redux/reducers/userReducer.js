import { FETCH_FRIENDS } from '../actions/types';

const initialState = {
    items: [],
    item: {},
    friends: {
        items: []
    }
};

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_FRIENDS:
            return {
                ...state,
                friends: {
                    items: action.payload
                }
            };

        default:
            return state;
    }
}