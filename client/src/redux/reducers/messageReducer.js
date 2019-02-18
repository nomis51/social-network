import { FETCH_MESSAGES, NEW_MESSAGE, FETCH_CONVERSATIONS, SET_RECIPIENT, NEW_RECIPIENT_MESSAGE, RECIPIENT_IS_TYPING } from '../actions/types';

const initialState = {
    userMessages: [],
    recipientMessages: [],
    item: {},
    conversations: {
        items: []
    },
    recipient_id: '',
    isRecipientTyping: false
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
                item: action.payload,
                recipientItem: {}
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
                recipientItem: action.payload,
                item: {}
            };

        case RECIPIENT_IS_TYPING:
            return {
                ...state,
                isRecipientTyping: action.payload
            };

        default:
            return state;
    }
}