import { configureStore, applyMiddleware } from '@reduxjs/toolkit';
import rootReducer from './reducer';
import thunkMiddleware from 'redux-thunk';

const composed = applyMiddleware(thunkMiddleware);

const store = configureStore({
    reducer: rootReducer,
    enhancers: [composed],
});

export const fetchSomeData = (dispatch, getState) => {
    fetch('https://jsonplaceholder.typicode.com/todos')
        .then((response) => response.json())
        .then((todos) =>
            dispatch({ type: 'todos/todosLoaded', payload: todos })
        );

    const allTodos = getState().todos;
    console.log('Number of todos after loading: ', allTodos.length);
};

export default store;
