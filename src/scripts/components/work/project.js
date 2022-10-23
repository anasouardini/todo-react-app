import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import formHandler from '../shared/form/formHandler';
const {FORM_MODE, showForm, formAction} = formHandler;
import {sharedState, showMenu, renderMenu, renderForm} from '../shared/sharedUtils';
import Tag from '../shared/tag';
import {initBridge} from '../shared/bridger';
export default function Project(props) {
    const [state, setState] = useState(sharedState(props.itemObj, 'Workflow', 'Project'));

    useEffect(() => {
        initBridge(state.itemObj.ID, (newState = undefined) => {
            let newStateCpy = newState ?? state;
            setState({
                ...newStateCpy,
                itemObj: props.itemObj,
            });
        });
    }, []);

    const style = {
        project: {
            position: 'relative',
            padding: '1rem',
            borderRadius: '10px',
            marginRight: '1.5rem',
            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset',

            edit: {
                cursor: 'pointer',
                position: 'absolute',
                top: '6px',
                right: '1rem',
                fontWeight: 'bolder',
                fontSize: '1.5rem',
            },
        },
    };

    return (
        <div style={style.project}>
            {/* project tags */}
            <div className="tags">
                {state.itemObj.fields.tags.value.map((tag) => (
                    <Tag key={tag.ID} style={{color: tag.color, background: tag.background}}>
                        {tag.text}
                    </Tag>
                ))}
            </div>

            <h3 style={{paddingRight: '25px'}}>
                <Link to={`/project/${state.itemObj.ID}`}>{state.itemObj.fields.title.value}</Link>
            </h3>
            <div
                style={style.project.edit}
                onClick={(e) => {
                    e.stopPropagation();
                    showMenu({setState, state});
                }}
            >
                ...
            </div>
            <p style={{marginTop: '.5rem'}}>{state.itemObj.fields.desc.value}</p>

            {/* Menu */}
            {renderMenu({state, setState})}
            {/* form */}
            {renderForm({state, setState})}
        </div>
    );
}
