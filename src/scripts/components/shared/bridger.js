export const Bridge = {};

export const bridgeState = (ID, bridge, newState) => {
    if (newState) {
        Bridge[ID][bridge].state = newState;
    }
    Bridge[ID][bridge].render(Bridge[ID][bridge].state);
};

export const initBridge = (ID, bridgesObj) => {
    if (!bridgesObj?.render) {
        bridgesObj.render = () => {
            console.error('render function is not set');
        };
    }

    Bridge[ID] = {...bridgesObj};
};

//TODO: add a state getter
//TODO: separate states, and pass setState as the CB
