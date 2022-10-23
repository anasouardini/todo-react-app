const {objMerge, deepClone} = require('../utils/tools');

//! make sure this doesn't reach production
// auth and get username
const verifiedUsername = 'bliyla';
const updateHash = 'lola';

const commonFields = {
    title: {type: 'text'},
    desc: {type: 'text'},
    notes: {type: 'text'},
    dueDate: {type: 'text'},
    order: {type: 'text'},
    priority: {type: 'text'},
    tagsIDs: {type: 'tags'},
};

const restructureAll = (parent) => {
    // console.log('parent', parent.type);
    let dbObj = {};

    if (parent.type == 'dbObj') {
        // set dbObj.tags
        parent.tags.forEach((tag) => {
            delete tag.username;
            if (dbObj.hasOwnProperty('tags')) {
                dbObj.tags.items[tag.id] = tag;
            } else {
                dbObj.tags = {
                    items: {
                        [tag.id]: tag,
                    },
                };
            }
        });
        // set dbObj.profiles
        parent.profiles.forEach((profile) => {
            if (dbObj.hasOwnProperty('profiles')) {
                dbObj.profiles.items[profile.id] = profile;
            } else {
                dbObj.profiles = {
                    items: {
                        [profile.id]: profile,
                    },
                };
            }
        });
    }

    if (parent?.children) {
        parent.children.forEach((child) => {
            // console.log('child', child.type);
            if (child.type == 'workflow') {
                child.parent = 'dummy';
            }
            if (child?.children) {
                child.childrenIDs = [];

                child.children.forEach((childChild) => {
                    child.childrenIDs.push(childChild.id);
                });
                // console.log(child.childrenIDs);
            }

            child.fields = {};
            Object.keys(child).forEach((prop) => {
                if (Object.keys(commonFields).includes(prop)) {
                    if (prop == 'tagsIDs') {
                        // console.log(child[prop]);
                        child.fields.tagsIDs = {
                            type: commonFields[prop].type,
                            value: JSON.parse(child[prop]),
                        };
                        delete child[prop];
                    } else {
                        child.fields[prop] = {
                            type: commonFields[prop].type,
                            value: child[prop],
                        };
                        delete child[prop];
                    }
                }
            });

            dbObj = objMerge(dbObj, restructureAll(child));

            if (dbObj.hasOwnProperty(child.type)) {
                // the object item is already initiated...
                dbObj[child.type].items[child.id] = child;
            } else {
                // initiate the object item
                dbObj[child.type] = {
                    items: {
                        [child.id]: child,
                    },
                };
            }

            child.parentID = child.parent;

            delete child.username;
            delete child.children;
            delete child.createDate;
            delete child.parent;
        });
    }

    return dbObj;
};

const restructureCreate = (response) => {
    const item = deepClone(response);
    item.fields = {};

    Object.keys(item).forEach((prop) => {
        if (Object.keys(commonFields).includes(prop)) {
            item.fields[prop] = {
                type: commonFields[prop].type,
                value: item[prop],
            };
            delete item[prop];
        }
    });

    item.childrenIDs = [];
    item.parentID = item.parent ?? 'dummy'; //! make this generic

    delete item.username;
    delete item.childType; // remove this once you update the database
    delete item.createDate;
    delete item.parent;

    return item;
};

const parseInputs = (userInputs, controllerInputs) => {
    const inputsObj = {};
    Object.keys(userInputs).forEach((inputKey) => {
        if (
            inputKey != 'username' &&
            inputKey != 'id' &&
            inputKey != 'createDate' &&
            inputKey != 'type'
        ) {
            inputsObj[inputKey] = userInputs[inputKey];
        }
    });
    Object.keys(controllerInputs ?? {}).forEach((inputKey) => {
        inputsObj[inputKey] = controllerInputs[inputKey];
    });

    return inputsObj;
};

const getTableName = (itemType) => {
    return itemType.slice(0, 1).toUpperCase() + itemType.slice(1) + 's';
};

module.exports = {
    verifiedUsername,
    updateHash,
    restructureCreate,
    restructureAll,
    parseInputs,
    getTableName,
};
