import { FETCH_MESSAGES, NEW_MESSAGE, FETCH_CONVERSATIONS, SET_RECIPIENT, NEW_RECIPIENT_MESSAGE } from './types';
import { queryBuilder } from '../../helpers/queryBuilder';
import { requestHandler } from '../../helpers/requestHandler';
import socketIOClient from 'socket.io-client';

export const fetchConversations = () => dispatch => {
    const reqBody = queryBuilder(`
        query {
            conversations {
                user {
                    _id,
                    firstName,
                    lastName
                },
                recipient {
                    _id,
                    firstName,
                    lastName
                }
            }
        }
    `);

    fetch('http://localhost:8081/api/graphql', {
        method: 'POST',
        body: reqBody,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    })
        .then(res => res.json())
        .then(conversations =>
            dispatch(
                requestHandler(conversations, FETCH_CONVERSATIONS, 'conversations')
            )
        );
}

export const fetchMessages = (recipient_id) => dispatch => {
    const reqBody = queryBuilder(`
        query {
            messages(recipient_id: "${recipient_id}") {
                userMessages {
                    _id,
                    content,
                    creationTime
                },
                recipientMessages {
                    _id,
                    content,
                    creationTime
                }
            }
        }
    `);


    fetch('http://localhost:8081/api/graphql', {
        method: 'POST',
        body: reqBody,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
    })
        .then(res => res.json())
        .then(messages =>
            dispatch(
                requestHandler(messages, FETCH_MESSAGES, 'messages')
            )
        );
}

export const createMessage = (message) => dispatch => {
    dispatch({
        type: NEW_MESSAGE,
        payload: message
    });

    // const reqBody = queryBuilder(`
    //     mutation {
    //         createMessage(messageInput: {
    //             content: "${message.content}",
    //             recipient_id: "${message.recipient_id}"
    //         }) {
    //             _id,
    //             content,
    //             creationTime,
    //             creator {
    //                 _id,
    //                 lastName,
    //                 firstName,
    //             }
    //         }
    //     }
    // `);

    // fetch('http://localhost:8081/api/graphql', {
    //     method: 'POST',
    //     body: reqBody,
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${localStorage.getItem('token')}`
    //     }
    // })
    //     .then(res => res.json())
    //     .then(message =>
    //         dispatch(
    //             requestHandler(message, NEW_MESSAGE, 'createMessage')
    //         )
    //     );
}

export const setRecipient = (recipient_id) => dispatch => {
    dispatch({
        type: SET_RECIPIENT,
        payload: recipient_id
    });
}

export const listenForMessage = () => dispatch => {
    const socket = socketIOClient('http://localhost:8081', { query: `token=${sessionStorage.getItem('token')}` });
    socket.on('newMessage', (message) => {
        dispatch({
            type: NEW_RECIPIENT_MESSAGE,
            payload: message
        });
    });

    return socket.on('sendMessage', (message) => {
        dispatch({
            type: NEW_MESSAGE,
            payload: message
        });
    });
}