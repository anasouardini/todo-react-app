const merger = (state, newState) => {
    Object.keys(newState).forEach((key) => {
        if (typeof newState[key] != 'object' || newState[key] == null) {
            state[key] = newState[key];
        } else {
            if (!state.hasOwnProperty(key) || typeof state[key] != typeof newState[key]) {
                state[key] = newState[key];
            }
            merger(state[key], newState[key]);
        }
    });
};

const objMerge = (state, newState) => {
    merger(state, newState);
    return state;
};

const deepClone = (obj) => (obj ? JSON.parse(JSON.stringify(obj)) : null);

module.exports = {
    objMerge,
    deepClone,
};
