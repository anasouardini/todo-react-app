import {
    React,
    useEffect,
    useState,
    FORM_MODE,
    showForm,
    sharedState,
    showMenu,
    renderMenu,
    listChildren,
    renderForm,
    initBridge,
} from '../../imports/tools';
import {Project} from '../../imports/components';

export default function Workflow(props) {
    const [state, setState] = useState(sharedState(props.itemObj));

    useEffect(() => {
        initBridge(state.itemObj.id, state, (newState = undefined) => {
            let newStateCpy = newState ?? state;
            setState({
                ...newStateCpy,
                itemObj: props.itemObj,
            });
        });
    }, []);

    const style = {
        parent: {
            position: 'relative',
            padding: '.5rem',
            marginTop: '2rem',
            // boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset',

            title: {
                position: 'relative',
                width: 'max-content',

                edit: {
                    cursor: 'pointer',
                    position: 'absolute',
                    top: '-6px',
                    right: '-35px',
                },
            },

            addItem: {
                width: 'max-content',
                cursor: 'pointer',
            },

            list: {
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                marginTop: '.5rem',
            },
        },
    };

    return (
        <div style={style.parent}>
            <h2 style={style.parent.title}>
                {state.itemObj.fields.title.value}
                <div
                    style={style.parent.title.edit}
                    onClick={(e) => {
                        e.stopPropagation();
                        showMenu(state.itemObj.id);
                    }}
                >
                    ...
                </div>
            </h2>

            {/* new project button*/}
            <div
                style={style.parent.addItem}
                onClick={(e) => {
                    showForm(state.itemObj.id, FORM_MODE.create);
                }}
            >
                ADD ITEM
            </div>

            <div style={style.parent.list}>{listChildren(state.itemObj, Project)}</div>

            {/* Menu */}
            {/* {renderMenu(state.menu.show, state.itemObj.id)} */}
            {state.menu.show ? renderMenu(state.itemObj.id) : <></>}
            {/* form */}
            {state.form.show ? renderForm(state.itemObj.id) : <></>}
        </div>
    );
}
