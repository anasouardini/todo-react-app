import React, {Component, useState} from 'react';
import Form from '../shared/form/form';

import SubGoal from './subgoal';

import TODO from '../../todoModule';
import formHandler from '../shared/form/formHandler';
const {FORM_MODE, showForm, formAction} = formHandler;
import sharedState from '../shared/sharedState';
import Tag from '../shared/tag';

const Goal = (props) => {
    const [state, setState] = useState(sharedState(props.itemObj));

    const listSubGoals = () => {
        return Object.keys(state.itemObj.children).map((childKey) => {
            const child = state.itemObj.children[childKey];
            return <SubGoal key={child.ID} itemObj={child} parentID={state.itemObj.ID} />;
        });
    };

    // console.log(state.itemObj.childType);

    const style = {
        parent: {
            header: {
                edit: {
                    position: 'absolute',
                    top: '-4px',
                    right: '0',
                    cursor: 'pointer',
                    fontSize: '1.4rem',
                },
            },
        },
    };

    return (
        <div className="cards-container" data-id={state.itemObj.ID}>
            {/* goal tags */}
            <div className="tags">
                {state.itemObj.fields.tags.value.map((tag) => {
                    return <Tag tag={tag} />;
                })}
            </div>

            {/* goal header */}
            <div className="cards-container-header">
                <h4>{state.itemObj.fields.title.value} </h4>
                <span
                    style={style.parent.header.edit}
                    onClick={formHandler.showForm.bind(this, {setState, state}, FORM_MODE.edit)}
                >
                    ...
                </span>
            </div>

            {/* sub-goals list */}
            {listSubGoals()}

            {/* add a new sub goal Button */}
            <div
                className="add-card-btn add-new-subgoal"
                data-id={state.itemObj.ID}
                style={{order: '999999'}}
                onClick={formHandler.showForm.bind(this, {setState, state}, FORM_MODE.create)}
            >
                <p style={{pointerEvents: 'none', display: 'inline'}}>Add a New Card</p>
            </div>

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
};

export default Goal;
