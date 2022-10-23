import DOM from './dom.js';
import factories from './factories.js';

const TODO = (() => {
    let TAGS = {
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
            TAGS.push({background, color, text});
        },
        deleteTag: (index) => {
            TAGS.splice(index);
        },
    };

    //profileID-projectID-GoalID-subGoalID
    let IDsList = [];
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
        const reversed = childID.split('-').reverse().join('-');

        return getItemByID(
            reversed
                .slice(reversed.indexOf('-') + 1)
                .split('-')
                .reverse()
                .join('-')
        );
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
            DOM.drawProject(firstProject, document.querySelector('.project-board'));
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

    //CREATION
    const create = {
        //TODO: verify inputs
        workflow: (_, fields) => {
            //the dummy _ is a placeholder for an ID, to make thing consistent
            let workflowID = genID();
            work['children'][workflowID] = factories.workflow(workflowID, fields);
            saveWork();
            return workflowID;
        },
        project: (workflowID, fields) => {
            let projects = work['children'][workflowID]['children'];
            let projectID = workflowID + '-' + genID();
            projects[projectID] = factories.project(projectID, fields);
            saveWork();
            return projectID;
        },
        goal: (projectID, fields) => {
            const workflowID = projectID.slice(0, projectID.indexOf('-'));
            let goals = work['children'][workflowID]['children'][projectID]['children'];
            let goalID = projectID + '-' + genID();
            goals[goalID] = factories.goal(goalID, fields);
            saveWork();
            return goalID;
        },
        subgoal: (goalID, fields) => {
            // console.log(goalID);
            const workflowID = goalID.slice(0, goalID.indexOf('-'));
            const projectID =
                workflowID + '-' + goalID.slice(goalID.indexOf('-') + 1).slice(0, goalID.indexOf('-'));
            let subGoals = {};
            subGoals = work['children'][workflowID]['children'][projectID]['children'][goalID]['children'];
            let subGoalID = goalID + '-' + genID();
            subGoals[subGoalID] = factories.subgoal(subGoalID, fields);
            saveWork();
            return subGoalID;
        },
    };

    //MODIFICATION -- order matters
    const modifyItem = (ID, newFields) => {
        const itemKeys = Object.keys(newFields);
        const targetItem = getItemByID(ID);

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
        DOM,
        itemsFallback: factories.fallback,
        create,
        modifyItem,
        TAGS: {
            list: TAGS.list,
            createTag: TAGS.createTag,
            deleteTag: TAGS.deleteTag,
        },
        getItemByID,
        getParent,
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
