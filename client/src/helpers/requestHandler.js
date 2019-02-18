import { LOGOUT } from '../redux/actions/types';

export const requestHandler = (res, type, requestName) => {
    if (res.errors) {
        const authError = res.errors.filter((v, i) => {
            return v[requestName] === 'Unauthenticated';
        });

        if (authError) {
            localStorage.removeItem('token');
            return {
                type: LOGOUT,
                payload: {}
            };
        } else {
            throw new Error('Invalid request response');
        }
    } else if (res.data) {
        return {
            type,
            payload: res.data[requestName]
        }
    }
};