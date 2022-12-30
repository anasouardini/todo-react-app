import {
    TODO,
    React,
    useEffect,
    useState,
    sharedState,
    listChildren,
    renderForm,
    renderMenu,
    showForm,
    FORM_MODE,
    Bridge,
} from '../imports/tools';
import {Workflow} from '../imports/components';

export default function Work() {
    const [state, setState] = useState(sharedState(TODO.getWork()));
    // console.log(TODO.getWork());

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
                        itemObj: TODO.getWork(),
                    });
                },
            },
        };
        Bridge.initBridge(state.itemObj.id, bridges);
    }, []);

    const style = {
        parent: {
            width: '90vw',
            margin: '0 auto',
        },
    };

    return (
        <div style={style.parent}>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    showForm(state.itemObj.id, FORM_MODE.create);
                }}
            >
                New Workflow
            </button>

            <div>{listChildren(state.itemObj, Workflow)}</div>

            {state.menu.show ? renderMenu(state.itemObj.id) : <></>}
            {state.form.show ? renderForm(state.itemObj.id) : <></>}
        </div>
    );
}
