import {React, TODO, deepClone, FORM_MODE, showForm, bridge} from '../../imports/tools';
import {Form, ItemMenu} from '../../imports/components';

export const renderForm = (ID) => {
    const parentState = deepClone(bridge[ID].state);
    return <Form ID={ID} />;
};

export const renderMenu = (ID) => {
    const parentState = deepClone(bridge[ID].state);
    return (
        <ItemMenu
            ID={ID}
            showForm={() => {
                showForm(parentState.itemObj.ID, FORM_MODE.edit);
            }}
        />
    );
};

export const showMenu = (ID) => {
    const parentState = deepClone(bridge[ID].state);

    parentState.menu.show = true;
    bridge[ID].render(parentState);
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
