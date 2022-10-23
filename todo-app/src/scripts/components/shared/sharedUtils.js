import React from 'react';
import TODO from '../../todoModule';
import deepClone from '../../tools/deepClone';

import Form from './form/form';
import formHandler from './form/formHandler';
const {FORM_MODE, showForm, formAction} = formHandler;
import ItemMenu from './itemMenu';

export let sharedRenerer = {run: () => {}};

export const renderForm = ({state, setState}) =>
    state.form.show ? (
        <Form
            action={formAction.bind(this, {
                setState,
                state,
                sharedRenerer: sharedRenerer.run,
            })}
            itemObj={state.itemObj}
            form={state.form}
        />
    ) : (
        <></>
    );

export const renderMenu = ({state, setState}) =>
    state.menu.show ? (
        <ItemMenu
            showForm={showForm.bind(this, {setState, state}, FORM_MODE.edit)}
            itemObj={state.itemObj}
            form={state.form}
        />
    ) : (
        <></>
    );

export const showMenu = ({state, setState}) => {
    setState({
        ...deepClone(state),
        menu: {
            ...deepClone(state.menu),
            show: true,
        },
    });
};

export const sharedState = (itemObj) => {
    // console.log(Object.keys(itemObj.children).length);
    return {
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
