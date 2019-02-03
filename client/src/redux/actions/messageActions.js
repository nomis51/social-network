import { FETCH_MESSAGES, NEW_MESSAGE } from './types';
import { queryBuilder } from '../../helpers/queryBuilder';

export const fetchMessages = () => dispatch => {
    const reqBody = queryBuilder(`
            query {
                messages {
                    _id,
                    content,
                    creationTime,
                    creator {
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
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(messages => dispatch({
            type: FETCH_MESSAGES,
            payload: messages
        }));
}

export const createMessage = (message) => dispatch => {
    const reqBody = queryBuilder(`
        mutation {
            createMessage(mesageInput: {
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
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(message => dispatch({
            type: NEW_MESSAGE,
            payload: message
        }));
}