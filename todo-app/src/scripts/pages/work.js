import React, {useEffect, useState} from 'react';
import TODO from '../todoModule';
import {Link} from 'react-router-dom';
import Workflow from '../components/work/workflow';
import formHandler from '../components/shared/form/formHandler';
const {FORM_MODE, showForm, formAction} = formHandler;
import {sharedState, sharedRenerer, listChildren, renderForm} from '../components/shared/sharedUtils';

export default function Work(props) {
    const [state, setState] = useState(sharedState(TODO.getWork()));
    console.log(state.itemObj.children);

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

    return (
        <div style={style.parent}>
            <button onClick={formHandler.showForm.bind(this, {setState, state}, FORM_MODE.create)}>
                New Workflow
            </button>

            <div>{listChildren(state.itemObj.children, Workflow)}</div>

            {/* Form */}
            {renderForm({state, setState})}
        </div>
    );
}
