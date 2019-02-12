import { FETCH_MESSAGES, NEW_MESSAGE, FETCH_CONVERSATIONS } from '../actions/types';

const initialState = {
    conversationMessages: {},
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

        default:
            return state;
    }
}