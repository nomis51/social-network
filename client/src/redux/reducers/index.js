import { combineReducers } from 'redux';

import messageReducer from './messageReducer';
import authReducer from './authReducer';
import postReducer from './postReducer';

export default combineReducers({
    messages: messageReducer,
    posts: postReducer,
    auth: authReducer
});