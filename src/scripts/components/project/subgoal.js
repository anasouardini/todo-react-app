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
import {listTags} from '../shared/sharedUtils';

const SubGoal = (props) => {
    const [state, setState] = useState(sharedState(props.itemObj));

    // console.log('subgoal', state.form);
    useEffect(() => {
        initBridge(state.itemObj.id, state, (newState = undefined) => {
            let newStateCpy = newState ?? state;
            // console.log('state after mutate', state);
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
            <div key={state.itemObj.id} style={style.parent} className="card" draggable="true">
                {/* sub goal tags */}
                {listTags(state.form.fields.self.tags.value, Tag)}

                <p style={style.title}>{state.itemObj.fields.title.value}</p>

                {/* menu button */}
                <span
                    onClick={(e) => {
                        e.stopPropagation();
                        showMenu(state.itemObj.id);
                    }}
                    style={style.parent.edit}
                >
                    ...
                </span>
            </div>

            {state.menu.show ? renderMenu(state.itemObj.id) : <></>}
            {state.form.show ? renderForm(state.itemObj.id) : <></>}
        </>
    );
};

export default SubGoal;
