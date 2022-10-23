import React, {useState} from 'react';

// Components
import Form from '../shared/form/form';
import Tag from '../shared/tag';

// SHARED
import TODO from '../../todoModule';
import formHandler from '../shared/form/formHandler';
const {FORM_MODE, showForm, formAction} = formHandler;
import sharedState, {sharedRenerer} from '../shared/sharedState';

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
        <div style={style.parent} className="card" draggable="true" data-id={state.itemObj.ID}>
            {/* sub goal tags */}
            <div className="tags">
                {state.itemObj.fields.tags.value.map((tag) => {
                    return <Tag tag={tag} />;
                })}
            </div>

            <p style={style.title}>{state.itemObj.fields.title.value}</p>

            {/* EDIT */}
            <span
                onClick={formHandler.showForm.bind(this, {setState, state}, FORM_MODE.edit)}
                style={style.parent.edit}
            >
                ...
            </span>

            {/* Form */}
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
};

export default SubGoal;
