import { FETCH_FRIENDS } from './types';
import { queryBuilder } from './../../helpers/queryBuilder';

export const fetchFriends = () => dispatch => {
    const reqBody = queryBuilder(`
        query {
            friends {
                _id,
                firstName,
                lastName
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
        .then(friendsData => dispatch({
            type: FETCH_FRIENDS,
            payload: friendsData.data.friends
        }));
};