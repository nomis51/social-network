import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

const initialState = {
    auth: {
        token: localStorage.getItem('token')
    }
};

const middleware = [thunk];


const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

store.subscribe(() => {
    localStorage.setItem('token', store.getState().auth.token);
});

export default store;