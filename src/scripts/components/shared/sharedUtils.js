import {React, TODO, deepClone, FORM_MODE, showForm, bridge, bridgeState} from '../../imports/tools';
import {Form, ItemMenu} from '../../imports/components';

export const renderForm = (id) => {
    const parentState = deepClone(bridge[id].state);
    return <Form id={id} />;
};

export const renderMenu = (id) => {
    const parentState = deepClone(bridge[id]['itemObj'].state);
    return (
        <ItemMenu
            id={id}
            showForm={() => {
                showForm(parentState.itemObj.id, FORM_MODE.edit);
            }}
        />
    );
};

export const showMenu = (id) => {
    const parentState = deepClone(bridge[id]['itemObj'].state);

    parentState.menu.show = true;
    bridgeState(id, 'itemObj', parentState);
};

export const sharedState = (itemObj) => {
    return {
        itemObj,
        form: {
            show: false,
            mode: '',
            title: 'form',
            submit: '',
            fields: {
                self: deepClone(itemObj?.fields), //work doesn't have a fields prop
                child: deepClone(TODO.itemsFallback.getChildFields(itemObj?.type)),
            },
        },
        menu: {
            show: false,
        },
    };
};

export const listChildren = (parent, ChildComponent) => {
    // console.log(parent);

    const children = TODO.getChildren(parent.type, parent.id);
    return children.map((child) => {
        return <ChildComponent key={child.id} itemObj={child} />;
    });
};

export const listTags = (tags, TagComponent) => {
    // console.log(parent);
    return (
        <div className="tags">
            {(() => {
                return tags.map((tag) => {
                    return (
                        <TagComponent key={tag.id} style={{color: tag.fontclr, background: tag.bgclr}}>
                            {tag.text}
                        </TagComponent>
                    );
                });
            })()}
        </div>
    );
};
