import {
    React,
    useState,
    useEffect,
    TODO,
    FORM_MODE,
    showForm,
    sharedState,
    renderForm,
    showMenu,
    renderMenu,
    initBridge,
    bridge,
} from '../../imports/tools';
import {Tag} from '../../imports/components';

const SubGoal = (props) => {
    const [state, setState] = useState(sharedState(props.itemObj, 'Goal', 'SubGoal'));

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
