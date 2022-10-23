const factories = (() => {
    // const fieldTypes = {text: 'text', tags: 'tags', number: 'number'};

    const sharedFallbakProps_strong = {
        title: {
            type: 'text',
            value: 'new item title',
        },

        desc: {
            type: 'text',
            value: 'description goes here',
        },
        notes: {
            type: 'text',
            value: 'nothing to note',
        },
    };

    const sharedFallbakProps = {
        ...sharedFallbakProps_strong,
        priority: {
            type: 'priority',
            value: 0,
        },
        order: {
            type: 'number',
            value: 'auto',
        },
        tags: {
            type: 'tags',
            value: [],
        },
        // style: {
        //     type: 'text',
        //     value: 'color: red;',
        // },

        dueDate: {
            type: 'text',
            value: '9999-99-99 09:09:09',
        },
    };

    const fallback = {
        workflow: sharedFallbakProps_strong,
        project: sharedFallbakProps,
        goal: sharedFallbakProps,
        subgoal: sharedFallbakProps,

        getChildFields: function (parent) {
            // console.log('looking for: ', parent, ' s child');
            return this.relation.hasOwnProperty(parent) ? this[this.relation[parent]] : '';
        },
        relation: {
            work: 'workflow',
            workflow: 'project',
            project: 'goal',
            goal: 'subgoal',
            subgoal: null,
        },
    };

    const workflow = (ID, fields, parentID) => {
        //TODO: constraint API
        return {ID, fields, type: 'workflow', parentID};
    };

    const project = (ID, fields, parentID) => {
        //TODO: constraint API
        return {
            ID,
            fields,
            type: 'project',
            parentID,
        };
    };

    let goal = (ID, fields, parentID) => {
        //TODO: constraint API
        return {
            ID,
            fields,
            type: 'goal',
            parentID,
        };
    };

    const subgoal = (ID, fields, parentID) => {
        //TODO: constraint API
        return {
            ID,
            fields,
            type: 'subgoal',
            parentID,
        };
    };

    return {workflow, project, goal, subgoal, fallback};
})();

export default factories;
