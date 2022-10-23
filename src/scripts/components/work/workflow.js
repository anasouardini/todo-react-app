import React, {useEffect, useState} from 'react';
import Project from './project';

import Form from '../shared/form/form';
import formHandler from '../shared/form/formHandler';
const {FORM_MODE, showForm, formAction} = formHandler;
import sharedState, {sharedRenerer} from '../shared/sharedState';

export default function Workflow(props) {
    const [state, setState] = useState(sharedState(props.itemObj));

    const style = {
        parent: {
            position: 'relative',
            padding: '.5rem',
            marginTop: '2rem',
            // boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset',

            title: {
                position: 'relative',
                width: 'max-content',

                edit: {
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '-6px',
                    right: '-35px',
                },
            },

            addItem: {
                width: 'max-content',
                cursor: 'pointer',
            },

            list: {
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                marginTop: '.5rem',
            },
        },
    };

    const listChildren = () =>
        Object.keys(state.itemObj.children).map((childKey) => {
            const child = state.itemObj.children[childKey]; //child is project
            return <Project key={child.ID} itemObj={child} />;
        });

    return (
        <div style={style.parent}>
            <h2 style={style.parent.title}>
                {state.itemObj.fields.title.value}
                <div
                    style={style.parent.title.edit}
                    onClick={formHandler.showForm.bind(this, {setState, state}, FORM_MODE.edit)}
                >
                    ...
                </div>
            </h2>

            {/* new project button*/}
            <div
                style={style.parent.addItem}
                onClick={formHandler.showForm.bind(this, {setState, state}, FORM_MODE.create)}
            >
                ADD ITEM
            </div>

            <div style={style.parent.list}>{listChildren()}</div>

            {/* form */}
            {state.form.show ? (
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
            )}
        </div>
    );
}
