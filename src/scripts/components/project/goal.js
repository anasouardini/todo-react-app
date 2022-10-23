import React, {Component, useState} from 'react';

import SubGoal from './subgoal';

import TODO from '../../todoModule';
import formHandler from '../shared/form/formHandler';
const {FORM_MODE, showForm, formAction} = formHandler;
import {sharedState, sharedRenerer, listChildren, renderForm} from '../shared/sharedUtils';
import Tag from '../shared/tag';

const Goal = (props) => {
    const [state, setState] = useState(sharedState(props.itemObj));

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
        <div key={state.itemObj.ID} className="cards-container">
            {/* goal tags */}
            <div className="tags">
                {state.itemObj.fields.tags.value.map((tag) => (
                    <Tag key={tag.ID} style={{color: tag.color, background: tag.background}}>
                        {tag.text}
                    </Tag>
                ))}
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
            {listChildren(state.itemObj.children, SubGoal)}

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
            {renderForm({state, setState})}
        </div>
    );
};

export default Goal;
