import {
    React,
    useState,
    useEffect,
    Link,
    FORM_MODE,
    showForm,
    sharedState,
    showMenu,
    renderMenu,
    renderForm,
    initBridge,
} from '../../imports/tools';
import {Tag} from '../../imports/components';
import {listTags} from '../shared/sharedUtils';

export default function Project(props) {
    const [state, setState] = useState(sharedState(props.itemObj));

    useEffect(() => {
        initBridge(state.itemObj.id, state, (newState = undefined) => {
            let newStateCpy = newState ?? state;
            // console.log(newStateCpy);
            setState({
                ...newStateCpy,
                itemObj: props.itemObj,
            });
        });
    }, []);

    const style = {
        project: {
            position: 'relative',
            padding: '1rem',
            borderRadius: '10px',
            marginRight: '1.5rem',
            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset',

            edit: {
                cursor: 'pointer',
                position: 'absolute',
                top: '6px',
                right: '1rem',
                fontWeight: 'bolder',
                fontSize: '1.5rem',
            },
        },
    };
    return (
        <div style={style.project}>
            {/* project tags */}
            {listTags(state.form.fields.self.tags.value, Tag)}

            <h3 style={{paddingRight: '25px'}}>
                <Link to={`/project/${state.itemObj.id}`}>{state.itemObj.fields.title.value}</Link>
            </h3>
            <div
                style={style.project.edit}
                onClick={(e) => {
                    e.stopPropagation();
                    showMenu(state.itemObj.id);
                }}
            >
                ...
            </div>
            <p style={{marginTop: '.5rem'}}>{state.itemObj.fields.desc.value}</p>

            {state.menu.show ? renderMenu(state.itemObj.id) : <></>}
            {state.form.show ? renderForm(state.itemObj.id) : <></>}
        </div>
    );
}
