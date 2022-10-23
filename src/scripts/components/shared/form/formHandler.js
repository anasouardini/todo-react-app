import TODO from '../../../todoModule';
import deepClone from '../../../tools/deepClone';
import objMerge from '../../../tools/objMerge';
import {bridge} from '../bridger';

const formHandler = (() => {
    const FORM_MODE = {create: 'create', edit: 'edit', delete: 'delete', cancel: 'cancel'};

    const showForm = ({setState, state}, mode) => {
        // console.log('state', state);

        const newState = {
            // itemname,
            // parentName,
            // itemObj: state.itemObj,
            form: {
                // ...deepClone(state.form),
                show: true,
                mode,
                title:
                    mode == FORM_MODE.create
                        ? `create a new ${state.itemObj.childType}`
                        : `${state.itemObj.type}: ${state.form.fields.self.title.value}`,
                submit: mode,
            },
            menu: {
                // ...deepClone(state.menu),
                show: false,
            },
        };

        console.log(state.itemName);
        bridge[state.itemName].render(objMerge(state, newState), true);

        //! causes a render issue since the itemObj is not a reference
        // setState(objMerge(state, newState));
    };
    const formAction = ({setState, state, sharedRenerer}, options, action) => {
        console.log('formaction');
        switch (action) {
            case FORM_MODE.create:
                //! blindly trandporting properties over to the factory function
                TODO.create(
                    state.itemObj.childType,
                    options.itemObj.ID,
                    deepClone(options.form.fields.child)
                );
                break;
            case FORM_MODE.edit:
                TODO.modifyItem(options.itemObj.ID, options.form.fields.self);
                break;
            case FORM_MODE.delete:
                TODO.deleteItemByID(state.itemObj.ID);
                // sharedRenerer();
                //! the objMerge works because the render function overrides the itemObj to be a reference
                // bridge[state.itemName].render(objMerge(state, {form: {show: false}}));
                bridge[state.parentName].render(); //no args means to state mutation
                return;
                break;
        }

        bridge[state.itemName].render(
            objMerge(state, {
                form: {
                    show: false,
                    fields: {
                        self: deepClone(options.form.fields.self),
                    },
                },
            })
        );

        // setState({
        //     ...state,
        //     itemObj: state.itemObj,
        //     form: {
        //         ...state.form,
        //         show: false,
        //         fields: {
        //             self: deepClone(options.form.fields.self),
        //             child: deepClone(state.form.fields.child),
        //         },
        //     },
        // });
    };

    return {FORM_MODE, showForm, formAction};
})();

export default formHandler;
