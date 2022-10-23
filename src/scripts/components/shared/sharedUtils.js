import {React, TODO, deepClone, FORM_MODE, showForm} from '../../imports/tools';
import {Form, ItemMenu} from '../../imports/components';

export const renderForm = ({state, setState}) => {
    if (state.form.show) {
        return (
            <Form
                //! this shit show need to be fixed
                parentState={state}
            />
        );
    } else {
        return <></>;
    }
};

export const renderMenu = ({state, setState}) => {
    if (state.menu.show) {
        return (
            <ItemMenu
                parentState={state}
                // showForm={showForm.bind(this, {setState, state}, FORM_MODE.edit)}
                showForm={(...args) => {
                    showForm(state.itemObj.ID, FORM_MODE.edit, ...args);
                }}
            />
        );
    } else {
        console.log('render menu show ', state.menu.show);
        return <></>;
    }
};

export const showMenu = ({state, setState}) => {
    setState({
        ...deepClone(state),
        menu: {
            ...deepClone(state.menu),
            show: true,
        },
    });
};

export const sharedState = (itemObj, parentName, itemName) => {
    // console.log(Object.keys(itemObj.children).length);
    return {
        parentName,
        itemName,
        itemObj,
        form: {
            show: false,
            mode: '',
            title: 'form',
            submit: '',
            fields: {
                self: deepClone(itemObj.fields),
                child: itemObj?.children ? deepClone(TODO.itemsFallback.getChildFields(itemObj.type)) : null,
            },
        },
        menu: {
            show: false,
        },
    };
};

export const listChildren = (children, Child) => {
    return Object.keys(children).map((childKey) => {
        const child = children[childKey];
        return <Child key={child.ID} itemObj={child} />;
    });
};
