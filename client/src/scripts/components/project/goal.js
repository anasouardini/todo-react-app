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
    TODO,
} from '../../imports/tools';

import {FaPlus, FaPencilAlt} from 'react-icons/fa';

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
                    cursor: 'pointer',
                    fontSize: '1rem',
                },
            },
        },
    };

    const handleDragIn = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.currentTarget.style.border = '2px solid #555';
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.currentTarget.style.border = '';
    };

    const handleDrop = (e) => {
        // e.preventDefault();
        e.currentTarget.style.border = '';
        const subgoalID = e.dataTransfer.getData('subgoal');
        TODO.moveItem('subgoal', subgoalID, props.itemObj.id);
    };

    return (
        <div key={state.itemObj.id} className='cards-container'>
            {/* goal tags */}
            {listTags(state.form.fields.self.tags.value, Tag)}

            {/* goal header */}
            <div style={{marginBottom: '.8rem'}} className='cards-container-header'>
                <h4
                    style={{
                        fontSize: '1.3rem',
                        borderLeft: '4px solid rgb(40, 150, 200)',
                        paddingLeft: '0.5rem',
                        textTransform: 'capitalize',
                    }}
                >
                    {state.itemObj.fields.title.value}{' '}
                </h4>
                <div
                    aria-label='buttons'
                    style={{
                        width: '2.6rem',
                        color: 'rgb(40, 150, 200)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <span
                        style={style.parent.header.edit}
                        onClick={(e) => {
                            e.stopPropagation();
                            showMenu(state.itemObj.id);
                        }}
                    >
                        <FaPencilAlt />
                    </span>
                    {/* add a new sub goal Button */}
                    <div
                        className='add-card-btn add-new-subgoal'
                        data-id={state.itemObj.id}
                        style={{cursor: 'pointer', order: '999999'}}
                        onClick={(e) => {
                            e.stopPropagation();
                            showForm(state.itemObj.id, FORM_MODE.create);
                        }}
                    >
                        <FaPlus />
                    </div>
                </div>
            </div>

            {/* sub-goals list */}
            <div
                onDragOver={handleDragIn}
                onDragLeave={handleDragLeave}
                // onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                aria-label='subGoals'
                style={{display: 'flex', flexDirection: 'column', gap: '.5rem', minHeight: '38px'}}
            >
                {listChildren(state.itemObj, SubGoal)}
            </div>

            {state.menu.show ? renderMenu(state.itemObj.id) : <></>}
            {state.form.show ? renderForm(state.itemObj.id) : <></>}
        </div>
    );
};

export default Goal;
