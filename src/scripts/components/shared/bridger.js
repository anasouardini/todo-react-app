export const bridge = {};

export const bridgeState = (ID, newState) => {
    if (newState) {
        bridge[ID].state = newState;
    }
    bridge[ID].render(bridge[ID].state);
};

export const initBridge = (
    projID,
    state,
    render = () => {
        console.error('render function is not set');
    }
) => {
    bridge[projID] = {state, render};
};
