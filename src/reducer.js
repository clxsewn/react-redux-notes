import todosReducer from "./features/todos/todosSlice";
import filtersReducer from "./features/filters/filtersSlice";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    todos: todosReducer,
    filters: filtersReducer,
})

export default rootReducer;