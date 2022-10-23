import objMerge from '../tools/objMerge.js';
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

    const dbObj = {
        work: {
            items: {
                // dummy: {fields: {}, type: 'Work'},
            },
            typeDe: {
                parent: null,
                self: 'work',
                child: 'workflow',
            },
        },

        workflow: {
            items: {},
            typeDe: {
                parent: 'work',
                slef: 'workflow',
                child: 'project',
            },
        },

        project: {
            items: {},
            typeDe: {
                parent: 'workflow',
                self: 'project',
                child: 'goal',
            },
        },

        goal: {
            items: {},
            typeDe: {
                parent: 'project',
                self: 'goal',
                child: 'subgoal',
            },
        },

        subgoal: {
            items: {},
            typeDe: {
                parent: 'goal',
                self: 'subgoal',
                child: null,
            },
        },
    };

    const deleteItem = (itemType, id) => {
        delete dbObj[itemType].items[id];
    };

    const getWork = () => {
        return dbObj.work.items.dummy;
    };

    const getItem = (itemType, id) => {
        return dbObj[itemType].items[id];
    };

    const getParent = (id) => {
        const parentType = dbObj[itemType].typeDe.parent;
        const parentID = dbObj[itemType].items[id].parentID;
        return dbObj[parentType].items[parentID];
    };

    const getParentID = (childType, childID) => {
        return dbObj[childType][childID].parentID;
    };

    const getChildren = (itemType, itemID) => {
        console.log(dbObj[dbObj[itemType].typeDe.child]);
        const children = [];
        dbObj[itemType].items[itemID].childrenIDs.forEach((childID) => {
            children.push(dbObj[dbObj[itemType].typeDe.child].items[childID]);
        });

        return children;
    };

    const loadSavedWork = () => {
        const chachedWork = JSON.parse(localStorage.getItem('dbObj'));
        if (chachedWork) {
            objMerge(dbObj, chachedWork);
            console.log('dbObj', dbObj);
            // console.log('cache', chachedWork);
        }
    };

    const burnWork = () => {
        localStorage.removeItem('dbObj');
    };

    const moveItem = (itemID, newParentID) => {
        console.log('not implemented for now');
    };

    //! not fixed yet
    const isItemOutOfOrder = (item, isCreated) => {
        //! an awful way to do this

        if (item.order == 'auto') {
            return false;
        }

        const parent = item.type == 'workflow' ? dbObj : getParent(item.id);
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
    //! not fixed yet
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

    //! not fixed yet
    //CREATION
    const create = (creator, ...args) => {
        const creators = {
            //TODO: verify inputs
            workflow: (_, fields) => {
                //? the dummy _ is a placeholder for an ID, to make thing consistent

                let itemID = genID();
                const siblings = dbObj['children'];
                //? coersion is smiling
                if (fields.order.value == 'auto') {
                    fields.order.value = Object.keys(siblings).length + 1;
                }
                siblings[itemID] = factories.workflow(itemID, fields);
                return itemID;
            },
            project: (parentID, fields) => {
                let siblings = dbObj['children'][parentID]['children'];
                let itemID = parentID + '-' + genID();
                if (fields.order.value == 'auto') {
                    fields.order.value = Object.keys(siblings).length + 1;
                }
                siblings[itemID] = factories.project(itemID, fields);
                return itemID;
            },
            goal: (parentID, fields) => {
                const workflowID = parentID.slice(0, parentID.indexOf('-'));
                let siblings = dbObj['children'][workflowID]['children'][parentID]['children'];
                let itemID = parentID + '-' + genID();
                if (fields.order.value == 'auto') {
                    fields.order.value = Object.keys(siblings).length + 1;
                }
                siblings[itemID] = factories.goal(itemID, fields);
                return itemID;
            },
            subgoal: (parentID, fields) => {
                // console.log('parent id', parentID);
                const workflowID = parentID.slice(0, parentID.indexOf('-'));

                const middleID = parentID.slice(parentID.indexOf('-') + 1);
                const projectID = workflowID + '-' + middleID.slice(0, middleID.indexOf('-'));

                let siblings =
                    dbObj['children'][workflowID]['children'][projectID]['children'][parentID]['children'];

                let itemID = parentID + '-' + genID();
                if (fields.order.value == 'auto') {
                    fields.order.value = Object.keys(siblings).length + 1;
                }
                siblings[itemID] = factories.subgoal(itemID, fields);
                return itemID;
            },
        };

        // check order validity
        //! an awful way to do this
        //? this could cause a problem
        //! not fixed yet
        //fixItemOrder(isItemOutOfOrder({ID: `${args[0]}-dummy`, type: creator, ...args[1]}, false));

        creators[creator](...args);
    };

    //? MODIFICATION -- order matters
    const modifyItem = (itemType, ID, newFields) => {
        const itemKeys = Object.keys(newFields);
        const targetItem = dbObj[itemType].items[ID];

        // check order validity
        //! not fixed yet
        //fixItemOrder(isItemOutOfOrder({...targetItem, fields: newFields}, true));

        //TODO: verify inputs
        // if (properties.length != itemKeys.length) {
        //     console.error('the input properties do not match item properties');
        //     return;
        // }

        itemKeys.forEach((key) => {
            targetItem.fields[key] = newFields[key];
        });
    };

    //EXPORTS
    return {
        dbObj,
        itemsFallback: factories.fallback,
        create,
        modifyItem,
        tags,
        priorities,
        getItem,
        getParent,
        getParentID,
        getChildren,
        deleteItem,
        moveItem,
        loadSavedWork,
        burnWork,
        getWork,
    };
})();

export default TODO;
