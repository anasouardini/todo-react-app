import {
    TODO,
    React,
    useEffect,
    useState,
    Link,
    sharedState,
    listChildren,
    renderForm,
    renderMenu,
    showForm,
    FORM_MODE,
    initBridge,
} from '../imports/tools';
import {Workflow} from '../imports/components';

export default function Work(props) {
    const [state, setState] = useState(sharedState(TODO.getWork()));
    // console.log(TODO.getWork());

    useEffect(() => {
        initBridge(state.itemObj.id, state, (newState) => {
            let newStateCpy = newState ?? state;
            setState({
                ...newStateCpy,
                itemObj: TODO.getWork(),
            });
            // console.log(newState);
        });
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
