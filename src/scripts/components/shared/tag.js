import React from 'react';

export default function Tag(props) {
    const style = {
        tag: {
            background: props.tag.background,
            color: props.tag.color,
            ...props.tagStyle,
        },
    };

    return (
        <div className="tag" data-id={props.tag.ID} style={style.tag}>
            {props.tag.text}
        </div>
    );
}
