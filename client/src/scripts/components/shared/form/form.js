import {React, useState, FORM_MODE, deepClone, TODO, Bridge} from '../../../imports/tools';
import {TagsForm, Tag} from '../../../imports/components';

export default function Form(props) {
    //! FIX: unify the copy of the parent state
    const [state, setState] = useState({
        subForms: {
            show: '',
            tags: {
                modified: false,
                value: [],
            },
        },
        parentState: deepClone(Bridge.getState(props.id, 'itemObj')),
    });
    // console.log(deepClone(Bridges[props.id].state.form));

    const subFormsResolver = {
        tags: TagsForm,
    };

    const subFormAction = (returnedValue, action) => {
        // console.log(returnedValue);

        const newState = deepClone(state);
        let fields =
            newState.parentState.form.mode == 'edit'
                ? newState.parentState.form.fields.self
                : newState.parentState.form.fields.child;

        if (action == 'submit') {
            let field = fields[state.subForms.show];

            //- this is not flexible at all, cosider other subforms
            let identical = false;
            if (field.value.length) {
                identical = field.value.every((fieldsTag) =>
                    returnedValue.some((subFormTag) => subFormTag.id == fieldsTag.id)
                );
            } else {
                identical = !returnedValue.length;
            }

            field.value = returnedValue;

            newState.subForms[newState.subForms.show] = {
                modified: !identical,
                value: returnedValue,
            };
        }

        newState.subForms.show = '';

        // console.log('new state', newState);
        setState(newState);
    };
    const showSubForm = (subform, fieldValue) => {
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

    const parseFields = (fields) => {
        const fieldsCpy = deepClone(fields);
        Object.keys(fieldsCpy).forEach((fieldKey) => {
            if (fieldKey == 'tags') {
                // console.log(fieldsCpy[fieldKey]);
                if (fieldsCpy[fieldKey]?.value) {
                    fieldsCpy.tagsIDs = {
                        type: 'tagsIDs',
                        value: fieldsCpy[fieldKey].value.map((tag) => tag.id),
                    };
                } else {
                    // console.log(fieldsCpy);
                    fieldsCpy.tagsIDs = fieldsCpy[fieldKey].map((tag) => tag.id);
                }
                delete fieldsCpy[fieldKey];
            }
        });
        return fieldsCpy;
    };

    //- split this monster
    const formAction = async (action, e) => {
        if (!e.target.classList.contains('overlay') && !(e.target.tagName == 'BUTTON')) {
            return;
        }

        let newState = deepClone(state.parentState); // clone the old state

        const form = deepClone(state.parentState.form);
        let fields = undefined;
        if (action == FORM_MODE.edit) {
            fields = form.fields.self;
        } else if (action == FORM_MODE.create) {
            fields = form.fields.child;
        } else if (action == FORM_MODE.delete) {
            const parentID = TODO.getParentID(state.parentState.itemObj.type, state.parentState.itemObj.id);
            const response = await TODO.deleteItem(
                state.parentState.itemObj.type,
                state.parentState.itemObj.id
            );

            if (response) {
                //- wierd but the form doesn't unmount when I unmount it's parent
                state.parentState.form.show = false;
                Bridge.setState(props.id, 'itemObj', state.parentState); // unmount form

                // re-render parent // no state is changed
                Bridge.setState(parentID, 'itemObj');

                newState = deepClone(state.parentState);
            }
        }

        if (fields) {
            //! AN AWFUL WAY TO DO THIS
            // set all inputs
            const modifiedFields = {};
            [...document.querySelector('.fields').children].forEach((DOMField) => {
                const name = DOMField.getAttribute('name');
                const type = DOMField.getAttribute('data-type');

                if (type == 'tags') {
                    let subForm = state.subForms[type];

                    if (state.subForms[type].modified) {
                        modifiedFields[name] = subForm.value;
                        fields[name].value = subForm.value;
                    }
                } else {
                    let domFieldValue = DOMField.children[0].value;
                    if (fields[name].value != domFieldValue) {
                        modifiedFields[name] = domFieldValue;
                        fields[name].value = domFieldValue;
                    }
                }
            });

            // console.log('test', parseFields(fields));

            const itemType = state.parentState.itemObj.type;
            const itemID = state.parentState.itemObj.id;
            if (action == FORM_MODE.create) {
                //- blindly passing properties over to the factory function
                // console.log(fields);
                // console.log(newState.form.fields.child.tags);
                const response = await TODO.createItem(itemType, itemID, parseFields(fields));
                if (response) {
                    newState = deepClone(state.parentState);
                }
            } else if (action == FORM_MODE.edit) {
                const response = await TODO.modifyItem(itemType, itemID, parseFields(modifiedFields));
                if (response) {
                    newState = deepClone(state.parentState);
                }
            }
        }

        // console.log(newState);
        newState.form.show = false;
        Bridge.setState(props.id, 'itemObj', newState);
    };

    const listFields = () => {
        const fields =
            state.parentState.form.mode == 'edit'
                ? state.parentState.form.fields.self
                : state.parentState.form.fields.child;

        return Object.keys(fields).map((fieldKey) => {
            const field = fields[fieldKey];
            if (field.type == 'tags') {
                //- to make sure I don't show tagsIDs in the form

                if (fieldKey == 'tags') {
                    return (
                        <div name={field.type} data-type={field.type} key={fieldKey}>
                            <button
                                key={fieldKey}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    showSubForm(field.type, field.value);
                                }}
                            >
                                Add Tags
                            </button>
                            {field.value.map((tag) => (
                                <Tag key={tag.id} style={{color: tag.fontclr, background: tag.bgclr}}>
                                    {tag.text}
                                </Tag>
                            ))}
                        </div>
                    );
                }

                return <></>;
            } else if (field.type == 'priority') {
                // return (
                //     <label key={fieldKey} name={fieldKey} data-type={field.type}>
                //         {fieldKey}
                //         <select defaultValue={field.value} style={style.pannel.inputs.field}>
                //             {TODO.priorities.list.map((pri) => (
                //                 <option key={pri.text} value={pri.text}>
                //                     {pri.text}
                //                 </option>
                //             ))}
                //         </select>
                //     </label>
                // );
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
            <div
                className="overlay"
                onClick={(e) => {
                    e.stopPropagation();
                    formAction(FORM_MODE.cancel, e);
                }}
            >
                <div style={style.pannel} data-parent-id={state.parentState.itemObj.id}>
                    <h2 style={style.pannel.h2}>{state.parentState.form.title} </h2>

                    {/* inputs */}
                    <div className="fields" style={style.pannel.inputs}>
                        {listFields()}
                    </div>

                    {/* Buttons */}
                    <div style={style.pannel.buttons}>
                        <button
                            style={style.pannel.buttons.button}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                formAction(state.parentState.form.mode, e);
                            }}
                        >
                            {state.parentState.form.submit}
                        </button>
                        <button
                            style={style.pannel.buttons.button}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                formAction(FORM_MODE.cancel, e);
                            }}
                        >
                            Cancel
                        </button>

                        {/* DELETE BUTTON */}
                        {state.parentState.form.mode != 'create' ? (
                            <button
                                style={style.pannel.buttons.button}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    formAction(FORM_MODE.delete, e);
                                }}
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
