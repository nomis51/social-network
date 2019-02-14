import { FETCH_MESSAGES, NEW_MESSAGE, FETCH_CONVERSATIONS } from './types';
import { queryBuilder } from '../../helpers/queryBuilder';
import { requestHandler } from './../helpers/requestHandler';

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
            'Authorization': `Bearer ${localStorage.getItem('token')}`
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
            'Authorization': `Bearer ${localStorage.getItem('token')}`
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
    const reqBody = queryBuilder(`
        mutation {
            createMessage(messageInput: {
                content: "${message.content}",
                recipient_id: "${message.recipient_id}"
            }) {
                _id,
                content,
                creationTime,
                creator {
                    _id,
                    lastName,
                    firstName,
                }
            }
        }
    `);

    fetch('http://localhost:8081/api/graphql', {
        method: 'POST',
        body: reqBody,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(res => res.json())
        .then(message =>
            dispatch(
                requestHandler(message, NEW_MESSAGE, 'createMessage')
            )
        );
}