import {
    React,
    useEffect,
    useState,
    Link,
    useParams,
    TODO,
    FORM_MODE,
    showForm,
    sharedState,
    renderMenu,
    listChildren,
    renderForm,
    initBridge,
} from '../imports/tools';

import {Goal} from '../imports/components';

export default function ProjectPage() {
    const {ID} = useParams();
    const [state, setState] = useState(sharedState(TODO.getItemByID(ID), '', 'ProjectPage'));

    useEffect(() => {
        initBridge(state.itemObj.ID, state, (newState) => {
            let newStateCpy = newState ?? state;
            setState({
                ...newStateCpy,
                itemObj: TODO.getItemByID(ID),
            });
            // console.log(newState);
        });
    }, []);

    if (state.itemObj) {
        return (
            <>
                <div
                    style={{
                        background: '#333',
                        color: 'white',
                        padding: '.5rem',
                    }}
                    className="path"
                >
                    <Link to="/work">Work</Link>{' '}
                    <span style={{fontSize: '1.2rem'}}>&nbsp;&gt;&nbsp;&nbsp;</span>
                    {TODO.getParent(state.itemObj.ID).fields.title.value}{' '}
                    <span style={{fontSize: '1.2rem'}}>&nbsp;&gt;&nbsp;&nbsp;</span>
                    {state.itemObj.fields.title.value}
                </div>
                <div style={{marginTop: '2rem'}} className="project-container" data-id={state.itemObj.ID}>
                    {/* goals list */}
                    {listChildren(state.itemObj.children, Goal)}

                    {/* add a new goal Button*/}
                    <div
                        className="cards-container empty-cards-container add-new-goal"
                        data-id={state.itemObj.ID}
                        style={{order: '999999', cursor: 'pointer'}}
                        // onClick={showForm.bind(this, {setState, state}, FORM_MODE.create)}
                        onClick={(e) => {
                            showForm(state.itemObj.ID, FORM_MODE.create);
                        }}
                    >
                        <div style={{order: '999999', pointerEvents: 'none'}} className="add-goal-btn">
                            <p style={{display: 'inline'}}>Add a New Goal</p>
                        </div>
                    </div>

                    {/* Menu */}
                    {/* {renderMenu(state.menu.show, state.itemObj.ID)} */}
                    {state.menu.show ? renderMenu(state.itemObj.ID) : <></>}
                    {/* form */}
                    {state.form.show ? renderForm(state.itemObj.ID) : <></>}
                </div>
            </>
        );
    } else {
        return <h1>the project ID is not valid</h1>;
    }
}
