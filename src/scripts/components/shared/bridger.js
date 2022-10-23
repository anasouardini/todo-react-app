export const bridge = {};

export const initBridge = (projName, render = () => {}) => {
    bridge[projName] = {render};
};
