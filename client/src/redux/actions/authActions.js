import { LOGIN } from './types';

export const login = (email, password) => dispatch => {
    const reqBody = {
        query: `
            query {
                login(
                    email: "${email}", 
                    password: "${password}"
                ) {
                    token,
                    user_id,
                    tokenExpiration
                }
            }
        `
    }

    fetch('http://localhost:8081/api/graphql', {
        method: 'POST',
        body: JSON.stringify(reqBody),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(authData => {
            return dispatch({
                type: LOGIN,
                payload: authData.data.login
            });
        });
}