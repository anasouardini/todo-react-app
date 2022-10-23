import React, {useState, useEffect} from 'react';
import Tag from '../shared/tag';
import TODO from '../../todoModule';
import formHandler from '../shared/form/formHandler';
const {FORM_MODE, showForm, formAction} = formHandler;
import {sharedState, sharedRenerer, renderForm, showMenu} from '../shared/sharedUtils';
import {renderMenu} from '../shared/sharedUtils';
import {initBridge, bridge} from '../shared/bridger';
const SubGoal = (props) => {
    const [state, setState] = useState(sharedState(props.itemObj, 'Goal', 'SubGoal'));
    console.log('subgoal new state', state);
    //? need to overcome the strict mode
    // const componentName = arguments.callee.name;
    useEffect(() => {
        initBridge(state.itemObj.ID, (newState = {}, mutate = false) => {
            let newStateCpy = mutate ? newState : state;
            setState({
                ...newStateCpy,
                itemObj: props.itemObj,
            });
        });
    }, []);

    const style = {
        parent: {
            position: 'relative',
            title: {},
            edit: {
                position: 'absolute',
                top: '-4px',
                right: '10px',
                cursor: 'pointer',
                fontSize: '1.4rem',
            },
        },
    };
    return (
        <>
            <div key={state.itemObj.ID} style={style.parent} className="card" draggable="true">
                {/* sub goal tags */}
                <div className="tags">
                    {state.itemObj.fields.tags.value.map((tag) => (
                        <Tag key={tag.ID} style={{color: tag.color, background: tag.background}}>
                            {tag.text}
                        </Tag>
                    ))}
                </div>

                <p style={style.title}>{state.itemObj.fields.title.value}</p>

                {/* menu button */}
                <span
                    onClick={(e) => {
                        e.stopPropagation();
                        showMenu({setState, state});
                    }}
                    style={style.parent.edit}
                >
                    ...
                </span>
            </div>

            {/* Menu */}
            {renderMenu({state, setState})}
            {/* Form */}
            {renderForm({state, setState})}
        </>
    );
};

export default SubGoal;
