import { configureStore, applyMiddleware } from '@reduxjs/toolkit';
import rootReducer from './reducer';
import thunkMiddleware from 'redux-thunk';
import { reduxThunkMiddleware } from './exampleAddons/middleware';

// const composed = applyMiddleware(thunkMiddleware);
const composed = applyMiddleware(reduxThunkMiddleware);

const store = configureStore({
    reducer: rootReducer,
    enhancers: [composed],
});

export default store;
