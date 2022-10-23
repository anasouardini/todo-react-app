export const bridge = {};

export const initBridge = (projID, state, render = () => {}) => {
    bridge[projID] = {state, render};
};
