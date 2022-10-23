import {
    React,
    useEffect,
    useState,
    TODO,
    FORM_MODE,
    showForm,
    sharedState,
    renderMenu,
    listChildren,
    showMenu,
    renderForm,
    initBridge,
} from '../../imports/tools';

import {SubGoal, Tag} from '../../imports/components';

const Goal = (props) => {
    const [state, setState] = useState(sharedState(props.itemObj, 'ProjectPage', 'Goal'));

    useEffect(() => {
        initBridge(state.itemObj.ID, state, (newState = undefined) => {
            let newStateCpy = newState ?? state;
            setState({
                ...newStateCpy,
                itemObj: props.itemObj,
            });
        });
    }, []);

    const style = {
        parent: {
            header: {
                edit: {
                    position: 'absolute',
                    top: '-4px',
                    right: '0',
                    cursor: 'pointer',
                    fontSize: '1.4rem',
                },
            },
        },
    };
    return (
        <div key={state.itemObj.ID} className="cards-container">
            {/* goal tags */}
            <div className="tags">
                {state.itemObj.fields.tags.value.map((tag) => (
                    <Tag key={tag.ID} style={{color: tag.color, background: tag.background}}>
                        {tag.text}
                    </Tag>
                ))}
            </div>

            {/* goal header */}
            <div className="cards-container-header">
                <h4>{state.itemObj.fields.title.value} </h4>
                <span
                    style={style.parent.header.edit}
                    onClick={(e) => {
                        e.stopPropagation();
                        showMenu({setState, state});
                    }}
                >
                    ...
                </span>
            </div>

            {/* sub-goals list */}
            {listChildren(state.itemObj.children, SubGoal)}

            {/* add a new sub goal Button */}
            <div
                className="add-card-btn add-new-subgoal"
                data-id={state.itemObj.ID}
                style={{order: '999999'}}
                onClick={(e) => {
                    showForm(state.itemObj.ID, FORM_MODE.create);
                }}
            >
                <p style={{pointerEvents: 'none', display: 'inline'}}>Add a New Card</p>
            </div>

            {/* Menu */}
            {renderMenu({state, setState})}
            {/* Form */}
            {renderForm({state, setState})}
        </div>
    );
};

export default Goal;
