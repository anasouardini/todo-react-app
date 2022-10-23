import React from 'react';
import TODO from '../../todoModule';

import Form from './form/form';
import formHandler from './form/formHandler';

export let sharedRenerer = {run: () => {}};

export const renderForm = ({state, setState}) =>
    state.form.show ? (
        <Form
            action={formHandler.formAction.bind(this, {
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

export const sharedState = (itemObj) => {
    return {
        itemObj,
        form: {
            show: false,
            mode: '',
            title: 'form',
            submit: '',
            fields: {
                self: itemObj.fields,
                child: TODO.itemsFallback.getChildFields(itemObj.type),
            },
        },
    };
};

export const listChildren = (children, Child) => {
    return Object.keys(children).map((childKey) => {
        const child = children[childKey];
        return <Child key={child.ID} itemObj={child} />;
    });
};
