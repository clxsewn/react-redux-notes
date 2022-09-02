import {
    createSelector,
    createSlice,
    createAsyncThunk,
    createEntityAdapter,
} from '@reduxjs/toolkit';
import { client } from '../../api/client';
import { StatusFilters } from '../filters/filtersSlice';

const todosAdapter = createEntityAdapter();

const initialState = todosAdapter.getInitialState({
    status: 'idle', // or: 'loading', 'succeeded', 'failed'
});

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    const response = await client.get('/fakeApi/todos');
    return response.todos;
});

export const saveNewTodo = createAsyncThunk(
    'todos/saveNewTodo',
    async (text) => {
        const initialTodo = { text };
        const response = await client.post('/fakeApi/todos', {
            todo: initialTodo,
        });
        return response.todo;
    }
);

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

        todoDeleted: todosAdapter.removeOne,

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
                todosAdapter.setAll(state, action.payload);
                state.status = 'idle';
            })
            .addCase(saveNewTodo.fulfilled, todosAdapter.addOne);
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

export const { selectAll: selectTodos, selectById: selectTodoById } =
    todosAdapter.getSelectors((state) => state.todos);

export const selectTodoIds = createSelector(selectTodos, (todos) =>
    todos.map((todo) => todo.id)
);

export const selectFilteredTodos = createSelector(
    // First input selector: all todos
    selectTodos,
    // Second input selector: all filter values
    (state) => state.filters,
    // Output selector: receives both values
    (todos, filters) => {
        const { status, colors } = filters;
        const showAllCompletions = status === StatusFilters.All;
        if (showAllCompletions && colors.length === 0) {
            return todos;
        }

        const completedStatus = status === StatusFilters.Completed;
        // Return either active or completed todos based on filter
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
    // Pass our other memoized selector as an input
    selectFilteredTodos,
    // And derive data in the output selector
    (filteredTodos) => filteredTodos.map((todo) => todo.id)
);
