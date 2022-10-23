export const bridge = {};

export const bridgeState = (ID, newState) => {
    //! not a n efficient way to do this
    bridge[ID].state = newState ?? bridge[ID].state;
    bridge[ID].render(newState);
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
