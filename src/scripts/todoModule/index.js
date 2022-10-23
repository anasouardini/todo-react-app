import factories from './factories.js';

const TODO = (() => {
    const tags = {
        list: [
            {
                ID: '234578656',
                background: '#27ae60',
                color: '#fff',
                text: 'Not Done',
            },
            {
                ID: '754523452',
                background: '#d35400',
                color: '#fff',
                text: 'In Progress',
            },
            {
                ID: '874563423',
                background: '#2c3e50',
                color: '#fff',
                text: 'Done',
            },
        ],
        createTag: (background, color, text) => {
            this.list.push({background, color, text});
        },
        deleteTag: (index) => {
            this.list.splice(index, 1);
        },
    };

    const priorities = {
        list: [
            {
                background: '#2c3e50',
                color: '#fff',
                text: '0',
            },
            {
                background: '#2c3e50',
                color: '#fff',
                text: '1',
            },
            {
                background: '#2c3e50',
                color: '#fff',
                text: '2',
            },
        ],
        createpriority: (background, color, text) => {
            this.list.push({background, color, text});
        },
        deletepriority: (index) => {
            this.list.splice(index);
        },
    };

    //profileID-projectID-GoalID-subGoalID
    let IDsList = []; //! the worst idea ever
    const genID = () => {
        let rand = Math.ceil(Math.random() * 999999999999).toString();
        while (IDsList.includes(rand)) {
            rand = Math.ceil(Math.random() * 999999999999).toString();
        }
        IDsList.push(rand);
        return rand;
    };

    let work = {
        type: 'work',
        childType: 'workflow',
        ID: 'dummy',
        fields: {},
        children: {},
    };

    const deleteItemByID = (IDString) => {
        let item = work;
        const IDs = IDString.split('-');
        let length = 0;
        IDs.forEach((id) => {
            length += id.length + 1;
            let itemID = IDString.slice(0, length - 1);
            if (length >= IDString.length) {
                delete item['children'][itemID];
            } else {
                item = item['children'][itemID]; //-1 for the last '-'
            }
            //FIX two digits
        });

        saveWork();
    };

    const getFirstProject = () => {
        let workflw = work.children[Object.keys(work.children)[0]];
        return workflw.children[Object.keys(workflw.children)[0]].ID;
    };

    const getWork = () => {
        return work;
    };

    const getItemByID = (IDString) => {
        let item = work;
        const IDs = IDString.split('-');
        let length = 0;
        IDs.forEach((id) => {
            length += id.length + 1;
            item = item['children'][IDString.slice(0, length - 1)]; //-1 for the last '-'
            //FIX two digits
        });
        //TODO: return false when it doesn't exist
        return item;
    };

    const getParent = (childID) => {
        return getItemByID(getParentID(childID));
    };

    const getParentID = (childID) => {
        const reversed = childID.split('-').reverse().join('-');

        return reversed
            .slice(reversed.indexOf('-') + 1)
            .split('-')
            .reverse()
            .join('-');
    };

    const saveWork = () => {
        localStorage.setItem('workflowsObj', JSON.stringify(work));
    };

    const loadSavedWork = () => {
        const oldWorflows = JSON.parse(localStorage.getItem('workflowsObj'));
        if (oldWorflows) {
            work = oldWorflows;
            console.log(work);
        }
    };

    const showSavedWork = () => {
        if (Object.keys(work.children).length) {
            const firstProfile = work.children[Object.keys(work.children)[0]];
            const firstProject = firstProfile.children[Object.keys(firstProfile.children)[0]];
        }
    };

    const burnWork = () => {
        localStorage.removeItem('workflowsObj');
    };

    //TODO: make it generic, update the new parent's UI | add DOM.moveItem_DOM
    const moveItem = (itemID, newParentID) => {
        const draggedCardCpy = {...TODO.getItemByID(itemID)};
        TODO.deleteItemByID(itemID);
        const newItemID = genID();
        draggedCardCpy.ID = newParentID + '-' + newItemID;
        TODO.getItemByID(newParentID).children[draggedCardCpy.ID] = draggedCardCpy;
        saveWork();
        return draggedCardCpy.ID;
    };

    const isItemOutOfOrder = (item, isCreated) => {
        //! an awful way to do this

        if (item.order == 'auto') {
            return false;
        }

        const parent = item.type == 'workflow' ? work : getParent(item.ID);
        const siblins = parent.children;
        const resultObj = {siblins, child: item};
        let output = false;

        if (item.order < 1) {
            output = {...resultObj, status: 'behind'};
        }
        if (item.order > Object.keys(siblins).length + Number(!isCreated)) {
            output = {...resultObj, status: 'ahead'};
        }
        if (Object.keys(siblins).some((sibKey) => siblins[sibKey].order == item.order)) {
            output = {...resultObj, status: 'duplicated'};
        }

        console.log('out of order');
        return output;
    };

    const fixItemOrder = (fixOrder) => {
        if (fixOrder) {
            if (fixOrder.status == 'behind' || fixOrder.status == 'ahead') {
                fixOrder.child.order = fixOrder.siblins.length;
            } else if (fixOrder.status == 'duplicated') {
                for (let s = fixOrder.child.order; s <= fixOrder.siblins.length; s++) {
                    Object.values(fixOrder.siblins)[s - 1].order++;
                }
            }
        }

        console.log('FIXING out of order');
    };

    //CREATION
    const create = (creator, ...args) => {
        const creators = {
            //TODO: verify inputs
            workflow: (_, fields) => {
                //? the dummy _ is a placeholder for an ID, to make thing consistent

                let itemID = genID();
                const siblings = work['children'];
                //? coersion is smiling
                if (fields.order.value == 'auto') {
                    fields.order.value = Object.keys(siblings).length + 1;
                }
                siblings[itemID] = factories.workflow(itemID, fields);
                saveWork();
                return itemID;
            },
            project: (parentID, fields) => {
                let siblings = work['children'][parentID]['children'];
                let itemID = parentID + '-' + genID();
                if (fields.order.value == 'auto') {
                    fields.order.value = Object.keys(siblings).length + 1;
                }
                siblings[itemID] = factories.project(itemID, fields);
                saveWork();
                return itemID;
            },
            goal: (parentID, fields) => {
                const workflowID = parentID.slice(0, parentID.indexOf('-'));
                let siblings = work['children'][workflowID]['children'][parentID]['children'];
                let itemID = parentID + '-' + genID();
                if (fields.order.value == 'auto') {
                    fields.order.value = Object.keys(siblings).length + 1;
                }
                siblings[itemID] = factories.goal(itemID, fields);
                saveWork();
                return itemID;
            },
            subgoal: (parentID, fields) => {
                // console.log('parent id', parentID);
                const workflowID = parentID.slice(0, parentID.indexOf('-'));

                const middleID = parentID.slice(parentID.indexOf('-') + 1);
                const projectID = workflowID + '-' + middleID.slice(0, middleID.indexOf('-'));

                let siblings =
                    work['children'][workflowID]['children'][projectID]['children'][parentID]['children'];

                let itemID = parentID + '-' + genID();
                if (fields.order.value == 'auto') {
                    fields.order.value = Object.keys(siblings).length + 1;
                }
                siblings[itemID] = factories.subgoal(itemID, fields);
                saveWork();
                return itemID;
            },
        };

        // check order validity
        //! an awful way to do this
        //? this could cause a problem
        fixItemOrder(isItemOutOfOrder({ID: `${args[0]}-dummy`, type: creator, ...args[1]}, false));

        creators[creator](...args);
    };

    //? MODIFICATION -- order matters
    const modifyItem = (ID, newFields) => {
        const itemKeys = Object.keys(newFields);
        const targetItem = getItemByID(ID);

        // check order validity
        fixItemOrder(isItemOutOfOrder({...targetItem, fields: newFields}, true));

        //TODO: verify inputs
        // if (properties.length != itemKeys.length) {
        //     console.error('the input properties do not match item properties');
        //     return;
        // }

        itemKeys.forEach((key) => {
            targetItem.fields[key] = newFields[key];
        });
        saveWork();
    };

    //EXPORTS
    return {
        itemsFallback: factories.fallback,
        create,
        modifyItem,
        tags,
        priorities,
        getItemByID,
        getParent,
        getParentID,
        deleteItemByID,
        moveItem,
        saveWork,
        loadSavedWork,
        showSavedWork,
        burnWork,
        getWork,

        getFirstProject, ///temporary
    };
})();

export default TODO;
