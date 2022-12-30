import objMerge from '../tools/objMerge';
import factories from './factories';
import BRIDGE from '../bridge/bridge';
import deepClone from '../tools/deepClone';

const TODO = (() => {
    const dbObj = {
        hash: '',
        work: {
            items: {dummy: {type: 'work', id: 'dummy', childrenIDs: []}},
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

        tags: {
            items: {},
        },

        priorities: {
            items: {},
        },
    };

    const saveWork = () => {
        localStorage.setItem('dbObj', dbObj);
    };

    const getWork = () => {
        return dbObj.work.items?.dummy;
    };

    const getItem = (itemType, id) => {
        // console.log(dbObj[itemType].items);
        return dbObj[itemType].items[id];
    };

    const getParent = (itemType, id) => {
        const parentType = dbObj[itemType].typeDe.parent;
        const parentID = dbObj[itemType].items[id].parentID;
        // console.log(parentType, parentID);
        return dbObj[parentType].items[parentID];
    };

    const getParentID = (type, id) => {
        // console.log(dbObj[type].items);
        return dbObj[type].items[id].parentID;
    };

    const getChildren = (itemType, itemID) => {
        // console.log(dbObj[itemType].items[itemID]);
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
        // console.log(typeof chachedWork);
        if (chachedWork) {
            objMerge(dbObj, chachedWork);
        }
        console.log('dbObj', dbObj);
        // console.log('cache', chachedWork);

        // adding tags objects in each item of each component
        [dbObj.project, dbObj.goal, dbObj.subgoal].forEach((component) => {
            Object.values(component.items).forEach((item) => {
                if (item?.fields) {
                    // console.log(item.fields.tagsIDs.value);
                    item.fields.tags = {
                        type: 'tags',
                        value: item.fields.tagsIDs.value.map((id) => dbObj.tags.items[id]),
                    };
                }
            });
        });
        // console.log(dbObj.project.items);
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

    const updateHash = (res) => {
        dbObj.hash = res.hash;
        delete res.hash;
    };

    //ACTIONS
    const typeFixers = {
        tagsIDs: JSON.parse,
    };
    const fixTypes = (response) => {
        const res = deepClone(response);
        Object.keys(res.fields).forEach((key) => {
            const fixer = typeFixers[key];
            if (fixer) {
                res.fields[key].value = fixer(res.fields[key].value);
            }
        });

        return res;
    };

    const structureQuery = (fields, parentType, parentID) => {
        const flatenedFields = Object.keys(fields).reduce((acc, itemKey) => {
            return {...acc, [itemKey]: fields[itemKey].value};
        }, {});

        if (parentType != 'work') {
            flatenedFields.parent = parentID;
        }

        //TODO: verify inputs
        const query = {
            props: flatenedFields,
        };

        return query;
    };

    const restructureResponse = (response) => {
        const res = deepClone(response);
        if (res.fields?.tagsIDs) {
            // adding tags objects in each item of each component
            if (res?.fields) {
                // console.log(res.fields.tagsIDs);
                res.fields.tags = {
                    type: 'tags',
                    value: res.fields.tagsIDs.value.map((id) => dbObj.tags.items[id]),
                };
            }
        }

        return res;
    };

    const createUser = async (password) => {
        const res = await BRIDGE.write('Users', {props: {password}});
        return !!res;
    };

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

        //- find a way to avoid parentType in strustrureQuery
        let res = restructureResponse(
            fixTypes(await BRIDGE.write(childType + 's', structureQuery(fields, parentType, parentID)))
        );

        if (res) {
            updateHash(res);

            dbObj[parentType].items[parentID].childrenIDs.push(res.id);
            dbObj[res.type].items[res.id] = res;

            saveWork();
            return true;
        }

        return false;
    };

    const modifyItem = async (itemType, id, modifiedFields) => {
        const itemKeys = Object.keys(modifiedFields);
        if (itemKeys.length) {
            // console.log('modfied', modifiedFields);
            const targetItem = dbObj[itemType].items[id];

            // check order validity
            //! not fixed yet
            //fixItemOrder(isItemOutOfOrder({...targetItem, fields: modifiedFields}, true));

            //TODO: verify inputs
            // if (properties.length != itemKeys.length) {
            //     console.error('the input properties do not match item properties');
            //     return;
            // }
            const query = {filters: {id}, data: {...modifiedFields}};

            const response = await BRIDGE.update(itemType + 's', query);

            if (response) {
                itemKeys.forEach((key) => {
                    targetItem.fields[key].value = modifiedFields[key];
                });

                return true;
            }
            return false;
        }
    };

    //- not tested yet
    const moveItem = async (itemType, itemID, newParentID) => {
        const response = await modifyItem(itemType, itemID, {parent: newParentID});

        if (response) {
            const childrenIDs = getParent(itemType, itemID).childrenIDs;
            childrenIDs.splice(childrenIDs.indexOf(itemID));
            dbObj[dbObj[itemType].typeDe.parent].items[newParentID].childrenIDs.push(itemID);
            return true;
        }

        return false;
    };

    const deleteItem = async (itemType, itemID) => {
        const res = await BRIDGE.remove(itemType + 's', {filters: {id: itemID}});
        if (res) {
            updateHash(res);

            // console.log(itemType, itemID);
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
        dbObj,
        itemsFallback: factories.fallback,
        createItem,
        modifyItem,
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

        //- temporary
        createUser,
    };
})();

export default TODO;
