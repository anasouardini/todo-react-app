import {
    React,
    useState,
    useEffect,
    sharedState,
    renderForm,
    showMenu,
    renderMenu,
    Bridge,
} from '../../imports/tools';
import {Tag} from '../../imports/components';
import {listTags} from '../shared/sharedUtils';

const SubGoal = (props) => {
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
