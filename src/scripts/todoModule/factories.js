const factories = (() => {
    const fallback = {
        workflow: {
            title: {
                type: 'text',
                value: 'new workflow',
            },
        },
        project: {
            style: {
                type: 'text',
                value: 'color: red;',
            },
            title: {
                type: 'text',
                value: 'new Porject',
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
        },
        goal: {
            tags: {
                type: 'tags',
                value: [],
            },
            style: {
                type: 'text',
                value: '',
            },
            title: {
                type: 'text',
                value: 'new goal',
            },
            desc: {
                type: 'text',
                value: 'new goal description',
            },
            dueDate: {
                type: 'text',
                value: 'undetermined',
            },
            notes: {
                type: 'text',
                value: 'nothing to note about my goals',
            },
        },
        subgoal: {
            tags: {
                type: 'tags',
                value: [],
            },
            style: {
                type: 'text',
                value: '',
            },
            title: {
                type: 'text',
                value: 'new subgoal',
            },
            desc: {
                type: 'text',
                value: 'subgoal description',
            },
            dueDate: {
                type: 'text',
                value: 'undetermined date',
            },
            notes: {
                type: 'text',
                value: 'notes notes notes',
            },
        },
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

    const workflow = (ID, {title = fallback.workflow.title.value}) => {
        //TODO: check args
        return {ID, fields: {title}, type: 'workflow', childType: 'project', children: {}};
    };

    const project = (
        ID,
        {
            style = fallback.project.style.value,
            title = fallback.project.title.value,
            desc = fallback.project.desc.value,
            dueDate = fallback.project.dueDate.value,
            notes = fallback.project.notes.value,
        }
    ) => {
        //TODO: check args
        return {
            ID,
            fields: {style, title, desc, dueDate, notes},
            type: 'project',
            childType: 'goal',
            children: {},
        };
    };

    let goal = function (
        ID,
        {
            tags = fallback.goal.tags.value,
            style = fallback.goal.style.value,
            title = fallback.goal.title.value,
            desc = fallback.goal.desc.value,
            dueDate = fallback.goal.dueDate.value,
            notes = fallback.goal.notes.value,
        }
    ) {
        //TODO: check args
        return {
            ID,
            fields: {tags, style, title, desc, dueDate, notes},
            type: 'goal',
            childType: 'subgoal',
            children: {},
        };
    };

    const subgoal = (
        ID,
        {
            tags = fallback.subgoal.tags.value,
            style = fallback.subgoal.style.value,
            title = fallback.subgoal.title.value,
            desc = fallback.subgoal.desc.value,
            dueDate = fallback.subgoal.dueDate.value,
            notes = fallback.subgoal.notes.value,
        }
    ) => {
        //TODO: check args
        return {ID, fields: {tags, style, title, desc, dueDate, notes}, type: 'subgoal'};
    };

    return {workflow, project, goal, subgoal, fallback};
})();

export default factories;
