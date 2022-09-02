import { createSlice } from '@reduxjs/toolkit';

export const StatusFilters = {
    All: 'all',
    Active: 'active',
    Completed: 'completed',
};

const initialState = {
    status: StatusFilters.All,
    colors: [],
};

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        statusFilterChanged(state, action) {
            state.status = action.payload;
        },

        colorFilterChanged(state, action) {
            if (state.colors.includes(action.payload)) {
                state.colors = state.colors.filter(
                    (color) => color !== action.payload
                );
            } else {
                state.colors.push(action.payload);
            }
        },

        clearFilters(state, action) {
            return initialState;
        },
    },
});

export const { statusFilterChanged, colorFilterChanged, clearFilters } =
    filtersSlice.actions;

export default filtersSlice.reducer;
