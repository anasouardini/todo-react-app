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
    const [state, setState] = useState(sharedState(TODO.getWork(), '', 'WorkPage'));
    console.log(state.itemObj.children);

    useEffect(() => {
        initBridge(state.itemObj.ID, state, (newState = undefined) => {
            let newStateCpy = newState ?? state;
            setState({
                ...newStateCpy,
                itemObj: TODO.getWork(),
            });
            console.log(newState);
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
                    showForm(state.itemObj.ID, FORM_MODE.create);
                }}
            >
                New Workflow
            </button>

            <div>{listChildren(state.itemObj.children, Workflow)}</div>

            {/* Menu */}
            {renderMenu({state, setState})}
            {/* Form */}
            {renderForm({state, setState})}
        </div>
    );
}
