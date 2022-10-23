import {
    React,
    useEffect,
    useState,
    FORM_MODE,
    showForm,
    sharedState,
    renderMenu,
    listChildren,
    showMenu,
    renderForm,
    Bridge,
} from '../../imports/tools';

import {SubGoal, Tag} from '../../imports/components';
import {listTags} from '../shared/sharedUtils';

const Goal = (props) => {
    // console.log(props.itemObj);
    const [state, setState] = useState(sharedState(props.itemObj));

    // state bridger
    useEffect(() => {
        const bridges = {
            itemObj: {
                state: state,
                render: (newState = undefined) => {
                    let newStateCpy = newState ?? state;
                    // console.log(newStateCpy);
                    setState({
                        ...newStateCpy,
                        itemObj: props.itemObj,
                    });
                },
            },
        };
        Bridge.initBridge(state.itemObj.id, bridges);
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
        <div key={state.itemObj.id} className="cards-container">
            {/* goal tags */}
            {listTags(state.form.fields.self.tags.value, Tag)}

            {/* goal header */}
            <div className="cards-container-header">
                <h4>{state.itemObj.fields.title.value} </h4>
                <span
                    style={style.parent.header.edit}
                    onClick={(e) => {
                        e.stopPropagation();
                        showMenu(state.itemObj.id);
                    }}
                >
                    ...
                </span>
            </div>

            {/* sub-goals list */}
            {listChildren(state.itemObj, SubGoal)}

            {/* add a new sub goal Button */}
            <div
                className="add-card-btn add-new-subgoal"
                data-id={state.itemObj.id}
                style={{order: '999999'}}
                onClick={(e) => {
                    e.stopPropagation();
                    showForm(state.itemObj.id, FORM_MODE.create);
                }}
            >
                <p style={{pointerEvents: 'none', display: 'inline'}}>Add a New Card</p>
            </div>

            {state.menu.show ? renderMenu(state.itemObj.id) : <></>}
            {state.form.show ? renderForm(state.itemObj.id) : <></>}
        </div>
    );
};

export default Goal;
