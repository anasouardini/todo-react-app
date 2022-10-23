import React, {useEffect, useState} from 'react';
import formHandler from './formHandler';
const {FORM_MODE} = formHandler;
import deepClone from '../../../tools/deepClone';

import TODO from '../../../todoModule';

import TagsForm from './TagsForm';
import Tag from '../tag';

export default function Form(props) {
    //! FIX: this component renders twi times
    const [state, setState] = useState({
        subForms: {
            show: '',
            tags: {
                value: [],
            },
        },
        parentState: {
            itemObj: deepClone(props.itemObj),
            form: {
                ...props.form,
                fields: deepClone(props.form.fields),
            },
        },
    });

    const subFormsResolver = {
        tags: TagsForm,
    };

    const subFormAction = (returnedValue, action) => {
        let tags =
            state.parentState.form.mode == 'edit'
                ? state.parentState.form.fields.self
                : state.parentState.form.fields.child;
        tags[state.subForms.show].value = returnedValue;

        let subFormState = {};

        if (action == 'submit') {
            subFormState = {
                [state.subForms.show]: {
                    value: returnedValue,
                },
            };
        }

        const newState = {
            ...state,
            subForms: {
                ...state.subForms,
                show: '',
                ...subFormState,
            },
        };

        // console.log('new state', newState);
        setState(newState);
    };
    const showSubForm = (subform, fieldValue, e) => {
        e.stopPropagation();

        setState({
            ...state,
            subForms: {
                ...state.subForms,
                show: subform,
                [subform]: {value: fieldValue},
            },
        });
    };

    const renderSubForm = () => {
        const subformType = state.subForms.show;
        const Component = subFormsResolver[subformType];
        return <Component fieldValue={state.subForms[subformType].value} action={subFormAction} />;
    };

    const style = {
        pannel: {
            background: 'rgba(255, 255, 255, 1)',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '500px',
            maxWidth: '100px',
            // height: 500px,
            // box-shadow: 0 0 0 100vw rgba(0, 0, 0, .5),
            borderRadius: '5px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',

            h2: {
                textAlign: 'center',
                marginBottom: '1.4rem',
            },

            inputs: {
                display: 'flex',
                // flex-direction: column,
                justifyContent: 'space-between',
                flexWrap: 'wrap',

                side: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                },

                field: {
                    display: 'block',
                    marginTop: '5px',
                },
            },

            buttons: {
                justifyContent: 'space-between',
                display: 'flex',
                button: {
                    padding: '3px 0',
                    marginTop: '40px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                },
            },
        },
    };

    const formAction = (action, e) => {
        e.stopPropagation();

        if (!e.target.classList.contains('overlay') && !(e.target.tagName == 'BUTTON')) {
            return;
        }
        const form = state.parentState.form;
        let fields = undefined;
        if (action == FORM_MODE.edit) {
            fields = form.fields.self;
        } else if (action == FORM_MODE.create) {
            fields = form.fields.child;
        }

        if (fields) {
            //! AN AWFUL WAY TO DO THIS
            //set all inputs
            [...document.querySelector('.fields').children].forEach((field) => {
                const name = field.getAttribute('name');
                const type = field.getAttribute('data-type');
                if (type == 'tags') {
                    fields[name].value = state.subForms[type].value;
                } else {
                    fields[name].value = field.children[0].value;
                }
            });
        }

        props.action(
            {
                itemObj: state.parentState.itemObj,
                form: form,
            },
            action
        );
    };

    const listFields = () => {
        const fields =
            state.parentState.form.mode == 'edit'
                ? state.parentState.form.fields.self
                : state.parentState.form.fields.child;
        // console.log('fields', fields);
        return Object.keys(fields).map((fieldKey) => {
            const field = fields[fieldKey];
            // console.log('field', field);
            if (field.type == 'tags') {
                return (
                    <div name={field.type} data-type={field.type} key={field.type}>
                        <button key={fieldKey} onClick={showSubForm.bind(this, field.type, field.value)}>
                            Add Tags
                        </button>
                        {field.value.map((tag) => (
                            <Tag key={tag.ID} style={{color: tag.color, background: tag.background}}>
                                {tag.text}
                            </Tag>
                        ))}
                    </div>
                );
            } else if (field.type == 'priority') {
                return (
                    <label key={fieldKey} name={fieldKey} data-type={field.type}>
                        {fieldKey}
                        <select defaultValue={field.value} style={style.pannel.inputs.field}>
                            {TODO.priorities.list.map((pri) => (
                                <option key={pri.text} value={pri.text}>
                                    {pri.text}
                                </option>
                            ))}
                        </select>
                    </label>
                );
            } else {
                return (
                    <label key={fieldKey} name={fieldKey} data-type={field.type}>
                        {fieldKey}
                        <input style={style.pannel.inputs.field} defaultValue={field.value} />
                    </label>
                );
            }
        });
    };

    return (
        <>
            <div className="overlay" onClick={formAction.bind(this, FORM_MODE.cancel)}>
                <div style={style.pannel} data-parent-id={state.parentState.itemObj.ID}>
                    <h2 style={style.pannel.h2}>{state.parentState.form.title} </h2>

                    {/* inputs */}
                    <div className="fields" style={style.pannel.inputs}>
                        {listFields()}
                    </div>

                    {/* Buttons */}
                    <div style={style.pannel.buttons}>
                        <button
                            style={style.pannel.buttons.button}
                            onClick={formAction.bind(this, state.parentState.form.mode)}
                        >
                            {state.parentState.form.submit}
                        </button>
                        <button
                            style={style.pannel.buttons.button}
                            onClick={formAction.bind(this, FORM_MODE.cancel)}
                        >
                            Cancel
                        </button>

                        {/* DELETE BUTTON */}
                        {state.parentState.form.mode != 'create' ? (
                            <button
                                style={style.pannel.buttons.button}
                                onClick={formAction.bind(this, FORM_MODE.delete)}
                            >
                                Delete
                            </button>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                {/* SUB FORM */}
            </div>
            {state.subForms.show != '' ? renderSubForm() : <></>}
        </>
    );
}
