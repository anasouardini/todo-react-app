import React, {useEffect, useState} from 'react';
import Project from './project';
import formHandler from '../shared/form/formHandler';
const {FORM_MODE, showForm, formAction} = formHandler;
import {sharedState, showMenu, renderMenu, listChildren, renderForm} from '../shared/sharedUtils';
import {initBridge} from '../shared/bridger';
export default function Workflow(props) {
    const [state, setState] = useState(sharedState(props.itemObj, 'WorkPage', 'Workflow'));

    //? need to overcome the strict mode
    // const componentName = arguments.callee.name;
    useEffect(() => {
        initBridge(state.itemObj.ID, (newState) => {
            setState({
                ...newState,
                itemObj: props.itemObj,
            });
        });
    }, []);

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

    return (
        <div style={style.parent}>
            <h2 style={style.parent.title}>
                {state.itemObj.fields.title.value}
                <div
                    style={style.parent.title.edit}
                    onClick={(e) => {
                        e.stopPropagation();
                        showMenu({setState, state});
                    }}
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

            <div style={style.parent.list}>{listChildren(state.itemObj.children, Project)}</div>

            {/* Menu */}
            {renderMenu({state, setState})}
            {/* Form */}
            {renderForm({state, setState})}
        </div>
    );
}
