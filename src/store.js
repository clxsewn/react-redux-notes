import { configureStore } from '@reduxjs/toolkit';

import todosSlice from './features/todos/todosSlice';
import filtersReducer from './features/filters/filtersSlice';

const store = configureStore({
    reducer: {
        todos: todosSlice,
        filters: filtersReducer,
    },
});

export default store;
