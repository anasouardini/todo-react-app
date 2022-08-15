import React, {useState} from 'react';

import Tag from '../tag';

export default function FormTags(props) {
    const {state, setState} = useState({
        formTag: {
            style: {filter: 'grayscale(1)'},
        },
    });

    const style = {
        formTags: {
            checkbox: {
                display: 'none',
                position: 'fixed',
                left: '-100vh',
                top: '-100vh',
            },
        },
    };

    const tagCheckbox = (e) => {
        e.stopPropagation();
        e.target.querySelector('input[type="checkbox"]').checked
            ? setState({style: {filter: 'grayscale(0)'}})
            : setState({style: {filter: 'grayscale(1)'}});
    };

    return (
        <div style={style.formTags} name="tags">
            {props.tags.map((tag) => {
                return (
                    <label key={tag.ID} onClick={tagCheckbox}>
                        <input type="checkbox" id={tag.ID} style={style.formTags.checkbox} />
                        <Tag tagStyle={state.style} tag={tag} />
                    </label>
                );
            })}
            {/* add tag */}
            <div>ADD TAG</div>
        </div>
    );
}
