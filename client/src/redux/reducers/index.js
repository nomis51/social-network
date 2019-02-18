import { combineReducers } from 'redux';

import messageReducer from './messageReducer';
import authReducer from './authReducer';
import postReducer from './postReducer';
import userReducer from './userReducer';

export default combineReducers({
    messages: messageReducer,
    posts: postReducer,
    auth: authReducer,
    users: userReducer,
});