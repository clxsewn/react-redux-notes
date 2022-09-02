import { client } from '../../api/client';
import {
    createSelector,
    createSlice,
    createAsyncThunk,
} from '@reduxjs/toolkit';
import { StatusFilters } from '../filters/filtersSlice';

const initialState = {
    status: 'idle', // or: 'loading', 'succeeded', 'failed'
    entities: {},
};

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    const response = await client.get('/fakeApi/todos');
    return response.todos;
});

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        todoAdded(state, action) {
            state.entities[action.payload.id] = action.payload;
        },

        todoToggled(state, action) {
            state.entities[action.payload].completed =
                !state.entities[action.payload].completed;
        },

        todoColorSelected: {
            reducer(state, action) {
                const { color, todoId } = action.payload;
                state.entities[todoId].color = color;
            },
            prepare(todoId, color) {
                return {
                    payload: { todoId, color },
                };
            },
        },

        todoDeleted(state, action) {
            delete state.entities[action.payload];
        },

        todosLoading(state, action) {
            state.status = 'loading';
        },

        todosLoaded(state, action) {
            action.payload.forEach((todo) => {
                state.entities[todo.id] = todo;
            });
            state.status = 'idle';
        },

        allCompleted(state, action) {
            Object.values(state.entities).forEach((todo) => {
                todo.completed = true;
            });
        },

        clearCompleted(state, action) {
            state.entities = Object.values(state.entities).filter(
                (todo) => todo.completed === false
            );
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                const newEntities = {};
                action.payload.forEach((todo) => {
                    newEntities[todo.id] = todo;
                });
                state.entities = newEntities;
                state.status = 'idle';
            })
            .addCase(saveNewTodo.fulfilled, (state, action) => {
                const todo = action.payload;
                state.entities[todo.id] = todo;
            });
    },
});

export const {
    todoAdded,
    todoToggled,
    todosLoading,
    todosLoaded,
    todoColorSelected,
    todoDeleted,
    allCompleted,
    clearCompleted,
} = todoSlice.actions;

export default todoSlice.reducer;

export const saveNewTodo = createAsyncThunk(
    'todos/saveNewTodo',
    async (text) => {
        const response = await client.post('/fakeApi/todos', {
            todo: { text },
        });
        return response.todo;
    }
);

const selectTodoEntities = (state) => state.todos.entities;

export const selectTodos = createSelector(selectTodoEntities, (entities) =>
    Object.values(entities)
);

export const selectTodoById = (state, todoId) => {
    return selectTodoEntities(state)[todoId];
};

export const selectFilteredTodos = createSelector(
    selectTodos,
    (state) => state.filters,
    (todos, filters) => {
        const { status, colors } = filters;
        const showAllCompletions = status === StatusFilters.All;
        if (showAllCompletions && colors.length === 0) {
            return todos;
        }

        const completedStatus = status === StatusFilters.Completed;
        return todos.filter((todo) => {
            const statusMatches =
                showAllCompletions || todo.completed === completedStatus;
            const colorMatches =
                colors.length === 0 || colors.includes(todo.color);
            return statusMatches && colorMatches;
        });
    }
);

export const selectFilteredTodoIds = createSelector(
    selectFilteredTodos,
    (filteredTodos) => filteredTodos.map((todo) => todo.id)
);
