export const reduxThunkMiddleware = (storeAPI) => (next) => (action) => {
    if (typeof action === 'function') {
        return action(storeAPI.dispatch, storeAPI.getState);
    }

    return next(action);
};
