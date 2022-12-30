import React from 'react';

export default function Tag(props) {
    const style = {
        tag: {
            display: 'inline-block',
            width: 'max-content',
            padding: '4px 10px 3px',
            marginBottom: '5px',
            marginLeft: '5px',
            borderRadius: '10px',
            fontSize: '.7rem',
            fontWeight: 'bolder',
            ...props.style,
        },
    };

    return (
        <label key="tag" style={style.tag}>
            {props.children}
        </label>
    );
}
