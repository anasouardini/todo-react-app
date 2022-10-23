import React, {useState} from 'react';

// Components
import Tag from '../shared/tag';

// SHARED
import TODO from '../../todoModule';
import formHandler from '../shared/form/formHandler';
const {FORM_MODE, showForm, formAction} = formHandler;
import {sharedState, sharedRenerer, renderForm} from '../shared/sharedUtils';

const SubGoal = (props) => {
    const [state, setState] = useState(sharedState(props.itemObj));

    const style = {
        parent: {
            position: 'relative',
            title: {},
            edit: {
                position: 'absolute',
                top: '-4px',
                right: '10px',
                cursor: 'pointer',
                fontSize: '1.4rem',
            },
        },
    };
    return (
        <>
            <div key={state.itemObj.ID} style={style.parent} className="card" draggable="true">
                {/* sub goal tags */}
                <div className="tags">
                    {state.itemObj.fields.tags.value.map((tag) => (
                        <Tag key={tag.ID} style={{color: tag.color, background: tag.background}}>
                            {tag.text}
                        </Tag>
                    ))}
                </div>

                <p style={style.title}>{state.itemObj.fields.title.value}</p>

                {/* EDIT */}
                <span
                    onClick={formHandler.showForm.bind(this, {setState, state}, FORM_MODE.edit)}
                    style={style.parent.edit}
                >
                    ...
                </span>
            </div>
            {/* Form */}
            {renderForm({state, setState})}
        </>
    );
};

export default SubGoal;
