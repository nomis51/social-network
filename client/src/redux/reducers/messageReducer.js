import { FETCH_MESSAGES, NEW_MESSAGE, FETCH_CONVERSATIONS, SET_RECIPIENT, NEW_RECIPIENT_MESSAGE } from '../actions/types';

const initialState = {
    userMessages: [],
    recipientMessages: [],
    item: {},
    conversations: {
        items: []
    },
    recipient_id: ''
};

export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_MESSAGES:
            return {
                ...state,
                ...action.payload
            };

        case NEW_MESSAGE:
            return {
                ...state,
                item: action.payload
            };

        case FETCH_CONVERSATIONS:
            return {
                ...state,
                conversations: {
                    items: action.payload
                }
            };

        case SET_RECIPIENT:
            return {
                ...state,
                recipient_id: action.payload
            };

        case NEW_RECIPIENT_MESSAGE:
            return {
                ...state,
                recipientItem: action.payload
            };

        default:
            return state;
    }
}