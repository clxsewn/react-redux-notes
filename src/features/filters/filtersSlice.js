export const StatusFilters = {
    All: 'all',
    Active: 'active',
    Completed: 'completed',
};

const initialState = {
    status: StatusFilters.All,
    colors: [],
};

export default function filtersReducer(state = initialState, action) {
    switch (action.type) {
        case 'filters/statusFilterChanged': {
            return {
                ...state,
                status: action.payload,
            };
        }

        case 'filters/colorFilterChanged': {
            return {
                ...state,
                colors: state.colors.includes(action.payload)
                    ? state.colors.filter((color) => color !== action.payload)
                    : [...state.colors, action.payload],
            };
        }

        case 'filters/clearFilters': {
            return {
                status: 'all',
                colors: [],
            };
        }

        default:
            return state;
    }
}

export const statusFilterChanged = (filter) => {
    return {
        type: 'filters/statusFilterChanged',
        payload: filter,
    };
};

export const colorFilterChanged = (color) => {
    return {
        type: 'filters/colorFilterChanged',
        payload: color,
    };
};
