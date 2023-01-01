import {React, useState, TODO, deepClone} from '../../../imports/tools';
import {Tag} from '../../../imports/components';

export default function TagsForm(props) {
    const [state, setState] = useState({
        tagsValue: deepClone(props.fieldValue),
        availTags: deepClone(Object.values(TODO.dbObj.tags.items)),
    });

    const style = {
        parent: {
            background: '#333',
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

            checkbox: {
                width: '10px',
                height: '10px',
                marginLeft: '.5rem',
                // display: 'none',
                // position: 'fixed',
                // left: '-100vh',
                // top: '-100vh',
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

    let usedTags = [];

    const tagCheckbox = (ID, e) => {
        e.stopPropagation();

        if (!usedTags.some((usedTag) => usedTag.id == ID)) {
            usedTags.push(Object.values(state.availTags).filter((availTag) => availTag.id == ID)[0]);
        } else {
            usedTags = usedTags.filter((usedTag) => usedTag.id != ID);
        }

        e.target.parentNode.style.filter = `grayscale(${Number(e.target.checked)})`;
    };

    const subFormAction = (action, e) => {
        e.stopPropagation();
        let tagsArray = [];
        if (action == 'submit') {
            tagsArray = usedTags;
        }

        props.action(tagsArray, action);
    };

    return (
        <div className="overlay">
            <div style={style.parent} id="availableTags">
                {/* fieldValue: array of tags */}

                {Object.values(state.availTags).length ? (
                    Object.values(state.availTags).map((tag) => {
                        const tagUsed = state.tagsValue.some((usedTag) => usedTag.id == tag.id);
                        if (tagUsed) {
                            usedTags = [...state.tagsValue];
                        }
                        // console.log(tag);
                        return (
                            <Tag
                                data-id={tag.id}
                                key={tag.id}
                                style={{
                                    color: tag.fontclr,
                                    background: tag.bgclr,
                                    filter: `grayscale(${Number(tagUsed)})`,
                                }}
                            >
                                {tag.text}
                                <input
                                    defaultChecked={tagUsed ? true : false}
                                    onChange={tagCheckbox.bind(this, tag.id)}
                                    type="checkbox"
                                    id={tag.id}
                                    style={style.parent.checkbox}
                                    value={tag.id}
                                />
                            </Tag>
                        );
                    })
                ) : (
                    <p>You Haven&apos;t created any tags yet!!</p>
                )}

                {/* Buttons */}
                <div style={style.parent.buttons}>
                    <button style={style.parent.buttons.button} onClick={subFormAction.bind(this, 'submit')}>
                        ADD
                    </button>
                    <button style={style.parent.buttons.button} onClick={subFormAction.bind(this, 'cancel')}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
