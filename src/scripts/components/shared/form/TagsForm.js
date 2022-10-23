import React, {useState} from 'react';
import TODO from '../../../todoModule';

import Tag from '../tag';

export default function TagsForm(props) {
    const [state, setState] = useState({
        tagsValue: [...props.fieldValue],
    });

    const style = {
        parent: {
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

    const availTags = [...TODO.TAGS.list];
    let usedTags = [];

    const tagCheckbox = (ID, e) => {
        e.stopPropagation();

        if (!usedTags.some((usedTag) => usedTag.ID == ID)) {
            usedTags.push(availTags.filter((availTag) => availTag.ID == ID)[0]);
        } else {
            usedTags = usedTags.filter((usedTag) => usedTag.ID != ID);
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

                {availTags.length ? (
                    availTags.map((tag, index) => {
                        const tagUsed = state.tagsValue.some((usedTag) => usedTag.ID == tag.ID);
                        if (tagUsed) {
                            usedTags = [...state.tagsValue];
                        }
                        return (
                            <Tag
                                data-id={tag.ID}
                                key={tag.ID}
                                style={{
                                    color: tag.color,
                                    background: tag.background,
                                    filter: `grayscale(${Number(tagUsed)})`,
                                }}
                            >
                                {tag.text}
                                <input
                                    defaultChecked={tagUsed ? true : false}
                                    onChange={tagCheckbox.bind(this, tag.ID)}
                                    type="checkbox"
                                    id={tag.ID}
                                    style={style.parent.checkbox}
                                    value={tag.ID}
                                />
                            </Tag>
                        );
                    })
                ) : (
                    <p>You Haven't created any tags yet!!</p>
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
