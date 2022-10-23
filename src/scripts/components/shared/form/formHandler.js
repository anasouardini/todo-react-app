import {objMerge, bridge, mutate, deepClone, bridgeState} from '../../../imports/tools';

const FORM_MODE = {create: 'create', edit: 'edit', delete: 'delete', cancel: 'cancel'};

const showForm = (ID, mode) => {
    const parentState = deepClone(bridge[ID].state); //deepCloning to be extra safe

    // console.log('show form state', parentState);

    //- METHOD ONE
    parentState.form.show = true;
    parentState.form.mode = mode;
    parentState.form.title =
        mode == FORM_MODE.create
            ? `create a new ${parentState.itemObj.childType}`
            : `${parentState.itemObj.type}: ${parentState.form.fields.self.title.value}`;
    parentState.form.submit = mode;
    parentState.menu.show = false;

    bridgeState(ID, parentState);

    //- METHOD TWO
    // const newState = {
    //     form: {
    //         show: true,
    //         mode,
    //         title:
    //             mode == FORM_MODE.create
    //                 ? `create a new ${parentState.itemObj.childType}`
    //                 : `${parentState.itemObj.type}: ${parentState.form.fields.self.title.value}`,
    //         submit: mode,
    //     },
    //     menu: {
    //         show: false,
    //     },
    // };

    // bridgeState(ID, objMerge(parentState, newState));
};

export {showForm, FORM_MODE};
