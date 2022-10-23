import objMerge from '../tools/objMerge';
import factories from './factories';
import BRIDGE from '../bridge/bridge';

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
        // createTag: (background, color, text) => {
        //     this.list.push({background, color, text});
        // },
        // deleteTag: (index) => {
        //     this.list.splice(index, 1);
        // },
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
        // createpriority: (background, color, text) => {
        //     this.list.push({background, color, text});
        // },
        // deletepriority: (index) => {
        //     this.list.splice(index);
        // },
    };

    const dbObj = {
        hash: '',
        work: {
            items: {},
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

    const saveWork = () => {
        localStorage.setItem('dbObj', dbObj);
    };

    const getWork = () => {
        return dbObj.work.items.dummy;
    };

    const getItem = (itemType, id) => {
        // console.log(dbObj[itemType].items);
        return dbObj[itemType].items[id];
    };

    const getParent = (itemType, id) => {
        const parentType = dbObj[itemType].typeDe.parent;
        const parentID = dbObj[itemType].items[id].parentID;
        return dbObj[parentType].items[parentID];
    };

    const getParentID = (type, id) => {
        console.log(dbObj[type].items);
        return dbObj[type].items[id].parentID;
    };

    const getChildren = (itemType, itemID) => {
        // console.log(dbObj[dbObj[itemType].typeDe.child]);
        const children = [];
        dbObj[itemType].items[itemID].childrenIDs.forEach((childID) => {
            children.push(dbObj[dbObj[itemType].typeDe.child].items[childID]);
        });

        return children;
    };

    const getChildType = (itemType) => {
        return dbObj[itemType].typeDe.child;
    };

    const getParentType = (itemType) => {
        dbObj[itemType].typeDe.parent;
    };

    const loadSavedWork = async (reactRenderCb) => {
        await BRIDGE.sync();

        const chachedWork = JSON.parse(localStorage.getItem('dbObj'));
        if (chachedWork) {
            objMerge(dbObj, chachedWork);
        }
        console.log('dbObj', dbObj);
        // console.log('cache', chachedWork);

        reactRenderCb();
    };

    const burnWork = () => {
        localStorage.removeItem('dbObj');
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

    const updateHahsh = (res) => {
        dbObj.hash = res.hash;
        delete res.hash;
    };

    //ACTIONS
    const createItem = async (parentType, parentID, fields) => {
        const childType = getChildType(parentType);

        let siblings = getChildren(parentType, parentID);
        if (fields?.order) {
            if (fields.order.value == 'auto') {
                fields.order.value = Object.keys(siblings).length + 1;
            } else {
                // check order validity
                //! an awful way to do this
                //? this could cause a problem
                //! not fixed yet
                //fixItemOrder(isItemOutOfOrder({ID: `${args[0]}-dummy`, type: creator, ...args[1]}, false));
            }
        }

        const flatenedFields = Object.keys(fields).reduce((acc, itemKey) => {
            return {...acc, [itemKey]: fields[itemKey].value};
        }, {});

        //TODO: verify inputs
        const res = await BRIDGE.write(childType + 's', {
            props: {...flatenedFields, parent: parentID, type: childType},
        });

        if (res) {
            updateHahsh(res);

            dbObj[parentType].items[parentID].childrenIDs.push(res.id);
            dbObj[res.type].items[res.id] = res;

            saveWork();
            return true;
        }

        return false;
    };

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

    const moveItem = (itemID, newParentID) => {
        console.log('not implemented for now');
    };

    const deleteItem = async (itemType, itemID) => {
        const res = await BRIDGE.remove(itemType + 's', {filters: {id: itemID}});
        if (res) {
            updateHahsh(res);

            const parentChildrenIDs = getParent(itemType, itemID).childrenIDs;
            const itemIDIndex = parentChildrenIDs.indexOf(itemID);

            delete dbObj[itemType].items[itemID];
            parentChildrenIDs.splice(itemIDIndex, 1);
            saveWork();
            return true;
        }

        return false;
    };

    //EXPORTS
    return {
        itemsFallback: factories.fallback,
        createItem,
        modifyItem,
        tags,
        priorities,
        getItem,
        getParent,
        getParentID,
        getChildren,
        getChildType,
        deleteItem,
        moveItem,
        loadSavedWork,
        burnWork,
        getWork,
    };
})();

export default TODO;
