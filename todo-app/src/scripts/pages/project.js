import React, {Component, useState} from 'react';
import {useParams, Link} from 'react-router-dom';
import TODO from '../todoModule';
import Goal from '../components/project/goal';
import formHandler from '../components/shared/form/formHandler';
const {FORM_MODE, showForm, formAction} = formHandler;
import {sharedState, sharedRenerer, listChildren, renderForm} from '../components/shared/sharedUtils';

const Project = () => {
    const {ID} = useParams();
    const [state, setState] = useState(sharedState(TODO.getItemByID(ID)));

    const forceRending = () => {
        setState({
            ...state,
            itemObj: TODO.getItemByID(ID),
        });
    };

    sharedRenerer.run = forceRending; //shared reference

    if (state.itemObj) {
        return (
            <>
                <div
                    style={{
                        background: '#333',
                        color: 'white',
                        padding: '.5rem',
                    }}
                    className="path"
                >
                    <Link to="/work">Work</Link>{' '}
                    <span style={{fontSize: '1.2rem'}}>&nbsp;&gt;&nbsp;&nbsp;</span>
                    {TODO.getParent(state.itemObj.ID).fields.title.value}{' '}
                    <span style={{fontSize: '1.2rem'}}>&nbsp;&gt;&nbsp;&nbsp;</span>
                    {state.itemObj.fields.title.value}
                </div>
                <div style={{marginTop: '2rem'}} className="project-container" data-id={state.itemObj.ID}>
                    {/* goals list */}
                    {listChildren(state.itemObj.children, Goal)}

                    {/* add a new goal Button*/}
                    <div
                        className="cards-container empty-cards-container add-new-goal"
                        data-id={state.itemObj.ID}
                        style={{order: '999999', cursor: 'pointer'}}
                        onClick={formHandler.showForm.bind(this, {setState, state}, FORM_MODE.create)}
                    >
                        <div style={{order: '999999', pointerEvents: 'none'}} className="add-goal-btn">
                            <p style={{display: 'inline'}}>Add a New Goal</p>
                        </div>
                    </div>

                    {/* form */}
                    {renderForm({state, setState})}
                </div>
            </>
        );
    } else {
        return <h1>the project ID is not valid</h1>;
    }
};

export default Project;
