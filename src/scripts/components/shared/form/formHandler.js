import {objMerge, bridge, deepClone} from '../../../imports/tools';

const FORM_MODE = {create: 'create', edit: 'edit', delete: 'delete', cancel: 'cancel'};

const showForm = (ID, mode) => {
    // console.log('state', state);
    const parentState = deepClone(bridge[ID].state); //deepCloning to be extra safe

    const newState = {
        form: {
            show: true,
            mode,
            title:
                mode == FORM_MODE.create
                    ? `create a new ${parentState.itemObj.childType}`
                    : `${parentState.itemObj.type}: ${parentState.form.fields.self.title.value}`,
            submit: mode,
        },
        menu: {
            show: false,
        },
    };

    // console.log(parentState.itemName);
    bridge[parentState.itemObj.ID].render(objMerge(parentState, newState));
};

export {showForm, FORM_MODE};
