import React, {useState} from 'react';
import objMerge from '../../tools/objMerge';
import {bridge} from './bridger';

export default function ItemMenu(props) {
    const [state, setState] = useState({
        parentState: props.parentState,
    });

    const style = {
        menu: {
            background: 'white',
            boxShadow: 'rgba(3, 102, 214, 0.3) 0px 0px 0px 3px',
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: '9999',
            transform: 'translate(-50%, -50%)',

            item: {
                minWidth: '130px',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
                padding: '.5rem',
                cursor: 'pointer',
            },
        },
    };

    return (
        <>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    // bridge[props.state.itemName].render(objMerge(props.state, {menu: {show: false}}));
                    bridge[state.parentState.itemObj.ID].render();
                }}
                className="overlay"
            ></div>
            <div style={style.menu}>
                <div style={style.menu.item} onClick={null}>
                    sort by
                </div>
                <div style={style.menu.item} onClick={null}>
                    delete
                </div>
                <div
                    style={style.menu.item}
                    onClick={(e) => {
                        e.stopPropagation();
                        props.showForm;
                    }}
                >
                    edit
                </div>
            </div>
        </>
    );
}
