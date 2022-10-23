const Bridges = {};

const setState = (componentID, bridge, newState) => {
    if (newState) {
        Bridges[componentID][bridge].state = newState;
    }
    Bridges[componentID][bridge].render(Bridges[componentID][bridge].state);
};

const getState = (componentID, bridge) => Bridges[componentID][bridge].state;

const initBridge = (componentID, bridgesObj) => {
    if (!bridgesObj?.render) {
        bridgesObj.render = () => {
            console.error('render function is not set');
        };
    }

    Bridges[componentID] = {...bridgesObj};
};

export const Bridge = {initBridge, getState, setState};

//TODO: separate states, and pass setState as the CB
