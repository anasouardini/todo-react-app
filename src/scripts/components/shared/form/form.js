import {
    React,
    useState,
    FORM_MODE,
    deepClone,
    TODO,
    bridge,
    bridgeState,
    objMerge,
} from '../../../imports/tools';
import {TagsForm, Tag} from '../../../imports/components';

export default function Form(props) {
    //! FIX: unify the copy of the parent state
    const [state, setState] = useState({
        subForms: {
            show: '',
            tags: {
                value: [],
            },
        },
        parentState: deepClone(bridge[props.ID].state),
    });
    // console.log(deepClone(bridge[props.ID].state.form));

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

    const formAction = (action, e) => {
        if (!e.target.classList.contains('overlay') && !(e.target.tagName == 'BUTTON')) {
            return;
        }

        const form = state.parentState.form;
        let fields = undefined;
        if (action == FORM_MODE.edit) {
            fields = form.fields.self;
        } else if (action == FORM_MODE.create) {
            fields = form.fields.child;
        } else if (action == FORM_MODE.delete) {
            TODO.deleteItemByID(state.parentState.itemObj.ID);
            //! the objMerge works because the render function overrides the itemObj to be a reference
            // bridge[state.itemName].render(objMerge(state, {form: {show: false}}));
            bridge[TODO.getParentID(state.parentState.itemObj.ID)].render(); //no args means to state mutation
            return;
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

            if (action == FORM_MODE.create) {
                //- blindly trandporting properties over to the factory function
                TODO.create(
                    state.parentState.itemObj.childType,
                    state.parentState.itemObj.ID,
                    deepClone(form.fields.child)
                );
            } else if (action == FORM_MODE.edit) {
                TODO.modifyItem(state.parentState.itemObj.ID, form.fields.self);
            }

            //! this step could be removed
            state.parentState.form.fields = deepClone(form.fields.self);
        }

        state.parentState.form.show = false;

        bridgeState(props.ID, state.parentState);
    };

    const listFields = () => {
        const fields =
            state.parentState.form.mode == 'edit'
                ? state.parentState.form.fields.self
                : state.parentState.form.fields.child;
        // console.log('form', state.parentState.form);
        return Object.keys(fields).map((fieldKey) => {
            const field = fields[fieldKey];
            // console.log('field', field);
            if (field.type == 'tags') {
                return (
                    <div name={field.type} data-type={field.type} key={field.type}>
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
            <div
                className="overlay"
                onClick={(e) => {
                    e.stopPropagation();
                    formAction(FORM_MODE.cancel, e);
                }}
            >
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
                            onClick={(e) => {
                                e.stopPropagation();
                                formAction(state.parentState.form.mode, e);
                            }}
                        >
                            {state.parentState.form.submit}
                        </button>
                        <button
                            style={style.pannel.buttons.button}
                            onClick={(e) => {
                                e.stopPropagation();
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
