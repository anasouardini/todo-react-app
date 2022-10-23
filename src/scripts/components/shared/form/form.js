import React, {useState} from 'react';
import formHandler from './formHandler';
const {FORM_MODE} = formHandler;

import TagsForm from './TagsForm';

export default function Form(props) {
    const [state, setState] = useState({
        subForms: {
            show: '',
            tags: {
                value: [],
            },
        },
    });

    const subFormsResolver = {
        tags: TagsForm,
    };

    const subFormAction = (returnedValue, action) => {
        let subFormState = {};

        if (action == 'submit') {
            subFormState = {
                [state.subForms.show]: {
                    value: returnedValue,
                },
            };
        }

        const newState = {
            subForms: {
                ...state.subForms,
                ...subFormState,
            },
        };

        //close subForm
        newState.subForms.show = '';
        setState(newState);
    };
    const showSubForm = (subform, fieldValue, e) => {
        e.stopPropagation();

        state.subForms[subform].value = fieldValue;
        setState({
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
        return (
            <Component
                data-type={subformType}
                fieldValue={state.subForms[subformType].value}
                action={subFormAction}
            />
        );
    };

    const style = {
        pannel: {
            background: 'rgba(255, 255, 255, 1)',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '500px',
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

        let fields = undefined;
        if (action == FORM_MODE.edit) {
            fields = props.form.fields.self;
        } else if (action == FORM_MODE.create) {
            fields = props.form.fields.child;
        }

        if (fields) {
            //! AN AWFUL WAY TO DO THIS
            //set all inputs
            [...document.querySelector('.fields').children].forEach((field) => {
                const name = field.getAttribute('name');
                const type = field.getAttribute('data-type');
                if (type != 'text') {
                    fields[name].value = state.subForms[type].value;
                } else {
                    fields[name].value = field.children[0].value;
                }
            });
        }
        props.action(
            {
                itemObj: props.itemObj,
                form: props.form,
            },
            action
        );
    };

    const listFields = () => {
        const fields = props.form.mode == 'edit' ? props.form.fields.self : props.form.fields.child;
        return Object.keys(fields).map((fieldKey) => {
            const field = fields[fieldKey];
            // console.log(field.type);
            if (field.type != 'text') {
                // return <TagsForm tags={field.value} key={fieldKey} />;
                return (
                    <button
                        data-type={field.type}
                        name={field.type}
                        key={fieldKey}
                        onClick={showSubForm.bind(this, field.type, field.value)}
                    >
                        Add Tags
                    </button>
                );
            } else {
                return (
                    <label key={fieldKey} name={fieldKey} data-type="text">
                        {fieldKey}
                        <input style={style.pannel.inputs.field} defaultValue={field.value} />
                    </label>
                );
            }
        });
    };

    return (
        <div className="overlay" onClick={formAction.bind(this, FORM_MODE.cancel)}>
            <div style={style.pannel} data-parent-id={props.itemObj.ID}>
                <h2 style={style.pannel.h2}>{props.form.title} </h2>

                {/* inputs */}
                <div className="fields" style={style.pannel.inputs}>
                    {listFields()}
                </div>

                {/* Buttons */}
                <div style={style.pannel.buttons}>
                    <button
                        style={style.pannel.buttons.button}
                        onClick={formAction.bind(this, props.form.mode)}
                    >
                        {props.form.submit}
                    </button>
                    <button
                        style={style.pannel.buttons.button}
                        onClick={formAction.bind(this, FORM_MODE.cancel)}
                    >
                        Cancel
                    </button>

                    {/* DELETE BUTTON */}
                    {props.form.mode != 'create' ? (
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
            {state.subForms.show != '' ? renderSubForm() : <></>}
        </div>
    );
}
