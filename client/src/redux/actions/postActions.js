import { FETCH_POSTS, NEW_POST } from './types';
import { queryBuilder } from './../../helpers/queryBuilder';
import { requestHandler } from '../helpers/requestHandler';

export const fetchPosts = () => dispatch => {
    const reqBody = queryBuilder(`
        query {
            posts {
                _id,
                content,
                creator {
                    _id,
                    firstName,
                    lastName
                },
                creationTime,
                lastUpdateTime
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
        .then(postData =>
            dispatch(
                requestHandler(postData, FETCH_POSTS, 'posts')
            )
        );
};

export const createPost = (post) => dispatch => {
    const reqBody = queryBuilder(`
        mutation {
            createPost(content: "${post.content}") {
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
        .then(postData =>
            dispatch(
                requestHandler(postData, NEW_POST, 'createPost')
            )
        );
}