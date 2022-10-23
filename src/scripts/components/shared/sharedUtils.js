import {React, TODO, deepClone, FORM_MODE, showForm, bridge} from '../../imports/tools';
import {Form, ItemMenu} from '../../imports/components';

export const renderForm = (show, ID) => {
    if (show) {
        // console.log('render form state', bridge[ID].state);
        const parentState = deepClone(bridge[ID].state);
        return <Form ID={ID} />;
    } else {
        return <></>;
    }
};

export const renderMenu = (show, ID) => {
    if (show) {
        const parentState = deepClone(bridge[ID].state);
        return (
            <ItemMenu
                ID={ID}
                showForm={() => {
                    showForm(parentState.itemObj.ID, FORM_MODE.edit);
                }}
            />
        );
    } else {
        // console.log('render menu show ', parentState.menu.show);
        return <></>;
    }
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
