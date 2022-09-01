export const fetchTodosMiddleware = (storeAPI) => (next) => (action) => {
    if (action.type === 'todos/fetchTodos') {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then((response) => response.json())
            .then((res) =>
                storeAPI.dispatch({ type: 'todos/todosLoaded', payload: res })
            );
    }

    return next(action);
};

export const asyncFunctionMiddleware = (storeAPI) => (next) => (action) => {
    if (typeof action === 'function') {
        return action(storeAPI.dispatch, storeAPI.getState);
    }

    return next(action);
};
