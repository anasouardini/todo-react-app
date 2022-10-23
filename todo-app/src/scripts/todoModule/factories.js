const factories = (() => {
    const fieldTypes = {text: 'text', tags: 'tags', number: 'number'};

    const sharedFallbakProps_strong = {
        title: {
            type: 'text',
            value: 'new item title',
        },

        order: {
            type: 'number',
            value: 'auto',
        },
        priority: {
            type: 'priority',
            value: {
                text: '0',
                color: '#000',
                backgound: '#bada55',
            },
        },
    };

    const sharedFallbakProps = {
        ...sharedFallbakProps_strong,
        tags: {
            type: 'tags',
            value: [],
        },
        style: {
            type: 'text',
            value: 'color: red;',
        },

        desc: {
            type: 'text',
            value: 'description goes here',
        },
        dueDate: {
            type: 'text',
            value: 'undetermined',
        },
        notes: {
            type: 'text',
            value: 'nothing to note',
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

    const defaultAttr = (type, childType = null, children = null) => {
        return {type, childType, children};
    };

    const workflow = (ID, fields) => {
        //TODO: constraint API
        return {ID, fields, ...defaultAttr('workflow', 'project', {})};
    };

    const project = (ID, fields) => {
        //TODO: constraint API
        return {
            ID,
            fields,
            ...defaultAttr('project', 'goal', {}),
        };
    };

    let goal = function (ID, fields) {
        //TODO: constraint API
        return {
            ID,
            fields,
            ...defaultAttr('goal', 'subgoal', {}),
        };
    };

    const subgoal = (ID, fields) => {
        //TODO: constraint API
        return {
            ID,
            fields,
            ...defaultAttr('subgoal', null, null),
        };
    };

    return {workflow, project, goal, subgoal, fallback};
})();

export default factories;
