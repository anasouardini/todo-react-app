import React, {useState} from 'react';
import TODO from '../todoModule';
import {Link} from 'react-router-dom';

import Workflow from '../components/work/workflow';

import Form from '../components/shared/form/form';
import formHandler from '../components/shared/form/formHandler';
const {FORM_MODE, showForm, formAction} = formHandler;
import sharedState, {sharedRenerer} from '../components/shared/sharedState';

export default function Work(props) {
    const [state, setState] = useState(sharedState(TODO.getWork()));

    const style = {
        parent: {
            width: '90vw',
            margin: '0 auto',
        },
    };

    const forceRending = () => {
        setState({
            ...state,
            itemObj: TODO.getWork(),
        });
    };
    sharedRenerer.run = forceRending; //shared reference

    const listChildren = () =>
        Object.keys(state.itemObj.children).map((childKey) => {
            const child = state.itemObj.children[childKey];
            return <Workflow key={child.ID} itemObj={child} />;
        });

    return (
        <div style={style.parent}>
            <button onClick={formHandler.showForm.bind(this, {setState, state}, FORM_MODE.create)}>
                New Workflow
            </button>

            <div>{listChildren()}</div>

            {/* Form */}
            {state.form.show ? (
                <Form
                    action={formHandler.formAction.bind(this, {setState, state})}
                    itemObj={state.itemObj}
                    form={state.form}
                />
            ) : (
                <></>
            )}
        </div>
    );
}
