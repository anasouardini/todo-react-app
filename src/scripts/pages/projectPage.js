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
    const [state, setState] = useState(sharedState(TODO.getItem('project', ID)));

    useEffect(() => {
        initBridge(state.itemObj.id, state, (newState) => {
            let newStateCpy = newState ?? state;
            setState({
                ...newStateCpy,
                itemObj: TODO.getItem('project', ID),
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
                    {TODO.getParent('project', state.itemObj.id).fields.title.value}{' '}
                    <span style={{fontSize: '1.2rem'}}>&nbsp;&gt;&nbsp;&nbsp;</span>
                    {state.itemObj.fields.title.value}
                </div>
                <div style={{marginTop: '2rem'}} className="project-container" data-id={state.itemObj.id}>
                    {/* goals list */}
                    {listChildren(state.itemObj, Goal)}

                    {/* add a new goal Button*/}
                    <div
                        className="cards-container empty-cards-container add-new-goal"
                        data-id={state.itemObj.id}
                        style={{order: '999999', cursor: 'pointer'}}
                        // onClick={showForm.bind(this, {setState, state}, FORM_MODE.create)}
                        onClick={(e) => {
                            showForm(state.itemObj.id, FORM_MODE.create);
                        }}
                    >
                        <div style={{order: '999999', pointerEvents: 'none'}} className="add-goal-btn">
                            <p style={{display: 'inline'}}>Add a New Goal</p>
                        </div>
                    </div>

                    {/* Menu */}
                    {/* {renderMenu(state.menu.show, state.itemObj.id)} */}
                    {state.menu.show ? renderMenu(state.itemObj.id) : <></>}
                    {/* form */}
                    {state.form.show ? renderForm(state.itemObj.id) : <></>}
                </div>
            </>
        );
    } else {
        return <h1>the project ID is not valid</h1>;
    }
}
