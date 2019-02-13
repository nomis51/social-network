import { LOGIN, LOGOUT } from './types';
import { requestHandler } from '../../helpers/requestHandler';

export const logout = () => dispatch => {
    localStorage.removeItem('token');
    dispatch({
        type: LOGOUT,
        payload: {
            token: null
        }
    });
}

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
        .then(authData =>
            dispatch(
                requestHandler(authData, LOGIN, 'login')
            )
        );
}