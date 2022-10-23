import React, {useEffect, useState} from 'react';
import TODO from '../todoModule';
import {Link} from 'react-router-dom';
import Workflow from '../components/work/workflow';
import formHandler from '../components/shared/form/formHandler';
const {FORM_MODE, showForm, formAction} = formHandler;
import {sharedState, listChildren, renderForm, renderMenu} from '../components/shared/sharedUtils';
import {initBridge} from '../components/shared/bridger';
export default function Work(props) {
    const [state, setState] = useState(sharedState(TODO.getWork(), '', 'WorkPage'));
    console.log(state.itemObj.children);

    //? need to overcome the strict mode
    // const componentName = arguments.callee.name;
    useEffect(() => {
        initBridge(state.itemObj.ID, (newState) => {
            setState({
                ...newState,
                itemObj: TODO.getWork(),
            });
        });
    }, []);

    const style = {
        parent: {
            width: '90vw',
            margin: '0 auto',
        },
    };

    return (
        <div style={style.parent}>
            <button onClick={formHandler.showForm.bind(this, {setState, state}, FORM_MODE.create)}>
                New Workflow
            </button>

            <div>{listChildren(state.itemObj.children, Workflow)}</div>

            {/* Menu */}
            {renderMenu({state, setState})}
            {/* Form */}
            {renderForm({state, setState})}
        </div>
    );
}
