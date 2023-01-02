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
import {FaPencilAlt} from 'react-icons/fa';

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
                top: '7px',
                right: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                color: 'rgb(40, 150, 200)',
            },
        },
    };

    const handleDragStart = (e) => {
        // e.preventDefault();
        e.dataTransfer.setData('subgoal', props.itemObj.id)
    };

    return (
        <>
            <style>
                {`
                .card{
                  padding: .5rem .8rem;
                  background: rgb(40 40 40);
                  border-radius: 5px
                }
                .card:hover
                {
                  background: rgb(50 50 50);
                  border-radius: 5px
                }
                `}
            </style>
            <div
                draggable='true'
                onDragStart={handleDragStart}
                key={state.itemObj.id}
                style={style.parent}
                className='card'
            >
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
                    <FaPencilAlt />
                </span>
            </div>

            {state.menu.show ? renderMenu(state.itemObj.id) : <></>}
            {state.form.show ? renderForm(state.itemObj.id) : <></>}
        </>
    );
};

export default SubGoal;
