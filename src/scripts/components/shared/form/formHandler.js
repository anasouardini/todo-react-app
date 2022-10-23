import objMerge from '../../../tools/objMerge';
import {bridge} from '../bridger';

const formHandler = (() => {
    const FORM_MODE = {create: 'create', edit: 'edit', delete: 'delete', cancel: 'cancel'};

    const showForm = ({setState, state}, mode) => {
        // console.log('state', state);

        const newState = {
            form: {
                show: true,
                mode,
                title:
                    mode == FORM_MODE.create
                        ? `create a new ${state.itemObj.childType}`
                        : `${state.itemObj.type}: ${state.form.fields.self.title.value}`,
                submit: mode,
            },
            menu: {
                show: false,
            },
        };

        console.log(state.itemName);
        bridge[state.itemObj.ID].render(objMerge(state, newState), true);

        //! causes a render issue since the itemObj is not a reference
        // setState(objMerge(state, newState));
    };

    return {FORM_MODE, showForm};
})();

export default formHandler;
