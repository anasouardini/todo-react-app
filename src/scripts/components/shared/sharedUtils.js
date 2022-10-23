import {React, TODO, deepClone, FORM_MODE, showForm, bridge} from '../../imports/tools';
import {Form, ItemMenu} from '../../imports/components';

export const renderForm = (id) => {
    const parentState = deepClone(bridge[id].state);
    return <Form id={id} />;
};

export const renderMenu = (id) => {
    const parentState = deepClone(bridge[id].state);
    return (
        <ItemMenu
            id={id}
            showForm={() => {
                showForm(parentState.itemObj.id, FORM_MODE.edit);
            }}
        />
    );
};

export const showMenu = (id) => {
    const parentState = deepClone(bridge[id].state);

    parentState.menu.show = true;
    bridge[id].render(parentState);
};

export const sharedState = (itemObj) => {
    // console.log(itemObj);
    return {
        itemObj,
        form: {
            show: false,
            mode: '',
            title: 'form',
            submit: '',
            fields: {
                self: deepClone(itemObj?.fields), //work doesn't have a fields prop
                child: deepClone(TODO.itemsFallback.getChildFields(itemObj?.type)),
            },
        },
        menu: {
            show: false,
        },
    };
};

export const listChildren = (parent, ChildComponent) => {
    const childType = TODO.getChildType(parent.type);

    const children = TODO.getChildren(parent.type, parent.id);
    return children.map((child) => {
        return <ChildComponent key={child.id} itemObj={child} />;
    });
};
