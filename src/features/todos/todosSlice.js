import { client } from '../../api/client';
import { createSelector } from 'reselect';
import { StatusFilters } from '../filters/filtersSlice';

const initialState = {
    status: 'idle', // or: 'loading', 'succeeded', 'failed'
    entities: [],
};

export default function todosReducer(state = initialState, action) {
    switch (action.type) {
        case 'todos/todoAdded': {
            return {
                ...state,
                entities: [...state.entities, action.payload],
            };
        }

        case 'todos/todoToggled': {
            return {
                ...state,
                entities: state.entities.map((todo) => {
                    if (todo.id !== action.payload) {
                        return todo;
                    }

                    return {
                        ...todo,
                        completed: !todo.completed,
                    };
                }),
            };
        }

        case 'todos/colorSelected': {
            return {
                ...state,
                entities: state.entities.map((todo) => {
                    if (todo.id !== action.payload.todoId) return todo;

                    return {
                        ...todo,
                        color: action.payload.color,
                    };
                }),
            };
        }

        case 'todos/allCompleted': {
            return {
                ...state,
                entities: state.entities.map((todo) => {
                    return {
                        ...todo,
                        completed: true,
                    };
                }),
            };
        }

        case 'todos/completedCleared': {
            return {
                ...state,
                entities: state.entities.filter((todo) => !todo.completed),
            };
        }

        case 'todos/todoDeleted': {
            return {
                ...state,
                entities: state.entities.filter(
                    (todo) => todo.id !== action.payload
                ),
            };
        }

        case 'todos/todosLoading': {
            return {
                ...state,
                status: 'loading',
            };
        }

        case 'todos/todosLoaded': {
            return {
                ...state,
                status: 'idle',
                entities: action.payload,
            };
        }

        default:
            return state;
    }
}

export const todosLoaded = (todos) => {
    return {
        type: 'todos/todosLoaded',
        payload: todos,
    };
};

export const todosLoading = () => ({ type: 'todos/todosLoading' });

export const fetchTodos = () => async (dispatch) => {
    dispatch(todosLoading());
    const response = await client.get('/fakeApi/todos');
    dispatch(todosLoaded(response.todos));
};

export const todoAdded = (todo) => ({
    type: 'todos/todoAdded',
    payload: todo,
});

export function saveNewTodo(text) {
    // And then creates and returns the async thunk function:
    return async function saveNewTodoThunk(dispatch, getState) {
        // ✅ Now we can use the text value and send it to the server
        const initialTodo = { text };
        const response = await client.post('/fakeApi/todos', {
            todo: initialTodo,
        });
        dispatch(todoAdded(response.todo));
    };
}

export const selectTodos = (state) => state.todos.entities;

export const selectTodoIds = createSelector(selectTodos, (todos) =>
    todos.map((todo) => todo.id)
);

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
