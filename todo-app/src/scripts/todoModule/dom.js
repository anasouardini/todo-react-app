let todoDOM = (() => {
    const createAddGoalBtn = (parent_DOM) => {
        //goal
        const goal_DOM = document.createElement('div');
        goal_DOM.style.order = '9999';
        goal_DOM.style.cursor = 'pointer';
        goal_DOM.classList.add('cards-container');
        goal_DOM.classList.add('empty-cards-container');
        goal_DOM.classList.add('add-new-goal');
        //add goal button
        const goalAddCard_DOM = document.createElement('div');
        goalAddCard_DOM.style.pointerEvents = 'none';
        goalAddCard_DOM.classList.add('add-goal-btn');
        goalAddCard_DOM.style.order = '9999';
        //add a goal
        const goalPar_DOM = document.createElement('p');
        goalPar_DOM.textContent = 'Add a New Goal';
        goalPar_DOM.style.display = 'inline';
        goalAddCard_DOM.appendChild(goalPar_DOM);
        goal_DOM.appendChild(goalAddCard_DOM);

        parent_DOM.appendChild(goal_DOM);
    };

    const createTag = (tag) => {
        const tag_DOM = document.createElement('div');
        tag_DOM.classList.add('tag');
        tag_DOM.setAttribute('data-ID', tag.ID);
        tag_DOM.textContent = tag.text;
        tag_DOM.style.backgroundColor = tag.background;
        tag_DOM.style.color = tag.color;
        return tag_DOM;
    };
    const drawTag = (tag, parent_DOM) => {
        if (parent_DOM) {
            parent_DOM.appendChild(createTag(tag));
        } else {
            console.error('the parrent Node doesnt exist');
        }
    };

    const createSubGoal = (subGoal) => {
        //subgoal
        const subGoal_DOM = document.createElement('div');
        subGoal_DOM.classList.add('card');
        subGoal_DOM.setAttribute('data-ID', subGoal.ID);
        subGoal_DOM.setAttribute('draggable', 'true');
        // subGoal_DOM.setAttribute('id', 'subgoal');
        //tags
        const subGoalTags_DOM = document.createElement('div');
        subGoalTags_DOM.style.pointerEvents = 'none';
        subGoalTags_DOM.classList.add('tags');
        subGoal_DOM.appendChild(subGoalTags_DOM);
        subGoal.tags.forEach((tag) => {
            drawTag(tag, subGoalTags_DOM);
        });
        //title
        const subGoalTitle_DOM = document.createElement('p');
        subGoalTitle_DOM.style.pointerEvents = 'none';
        subGoalTitle_DOM.textContent = subGoal.title;
        subGoal_DOM.appendChild(subGoalTitle_DOM);
        return subGoal_DOM;
    };
    const drawSubGoal = (subGoal, parent_DOM) => {
        let subGoal_DOM = {};
        if (parent_DOM) {
            subGoal_DOM = createSubGoal(subGoal);
            parent_DOM.appendChild(subGoal_DOM);
        } else {
            console.error('the parrent Node doesnt exist');
        }
    };
    const updateSubGoal = (subGoal, parent_DOM) => {
        document.querySelector(`[data-id="${subGoal.ID}"]`).remove();
        drawSubGoal(subGoal, parent_DOM);
    };

    const createGoal = (goal) => {
        //goal
        const goal_DOM = document.createElement('div');
        goal_DOM.classList.add('cards-container');
        goal_DOM.setAttribute('data-ID', goal.ID);
        //tags
        const goalTags_DOM = document.createElement('div');
        goalTags_DOM.classList.add('tags');
        goal_DOM.appendChild(goalTags_DOM);
        goal.tags.forEach((tag) => {
            drawTag(tag, goalTags_DOM);
        });
        //header
        const goalHeader_DOM = document.createElement('div');
        goalHeader_DOM.classList.add('cards-container-header');
        goal_DOM.appendChild(goalHeader_DOM);
        //title
        const goalHeaderTitle_DOM = document.createElement('h4');
        goalHeaderTitle_DOM.textContent = goal.title;
        goalHeader_DOM.appendChild(goalHeaderTitle_DOM);
        
        //add a card button
        const goalAddCard_DOM = document.createElement('div');
        goalAddCard_DOM.classList.add('add-card-btn');
        goalAddCard_DOM.classList.add('add-new-subgoal');
        goalAddCard_DOM.setAttribute('data-ID', goal.ID);
        goalAddCard_DOM.style.order = '9999';
        //add a card paragraph
        const goalPar_DOM = document.createElement('p');
        goalPar_DOM.style.pointerEvents = 'none';
        goalPar_DOM.textContent = 'Add a New Card';
        goalPar_DOM.style.display = 'inline';
        goalAddCard_DOM.appendChild(goalPar_DOM);

        goal_DOM.appendChild(goalAddCard_DOM);

        return goal_DOM;
    };
    const drawGoal = (goal, parent_DOM) => {
        let goal_DOM = {};
        if (parent_DOM) {
            goal_DOM = createGoal(goal);
            parent_DOM.appendChild(goal_DOM);
        } else {
            console.error('the parrent Node doesnt exist');
        }
        Object.keys(goal.children).forEach((subGoalID) => {
            drawSubGoal(goal.children[subGoalID], goal_DOM);
        });
    };
    const updateGoal = (goal, parent_DOM) => {
        document.querySelector(`[data-id="${goal.ID}"]`).remove();
        drawGoal(goal, parent_DOM);
    };

    const createProject = (project) => {
        const project_DOM = document.createElement('div');
        project_DOM.classList.add('project-container');
        project_DOM.setAttribute('data-ID', project.ID);
        return project_DOM;
    };
    const drawProject = (project, projectBoard_DOM) => {
        let project_DOM = {};
        if (projectBoard_DOM) {
            project_DOM = createProject(project);
            projectBoard_DOM.appendChild(project_DOM);
        } else {
            console.error('the parrent Node doesnt exist');
        }
        Object.keys(project.children).forEach((goalID) => {
            drawGoal(project.children[goalID], project_DOM);
        });
        //add the 'add new goal button'
        createAddGoalBtn(project_DOM);
    };
    const updateProject = (project, parent_DOM) => {
        document.querySelector(`[data-id="${project.ID}"]`).remove();
        drawProject(project, parent_DOM);
    };

    // const createProfile = () => {};
    // const drawProfile = (profile) => {
    //     drawProject();
    // };
    const removePanel = () => {
        document.querySelector('.overlay').remove();
        document.querySelector('.settings-panel').remove();
    };
    //TODO: OPTIMIZE
    const drawNewGoalPanel = (parentID, childrenNum) => {
        //overlay
        const settingoverlay_DOM = document.createElement('div');
        settingoverlay_DOM.classList.add('overlay');
        document.body.appendChild(settingoverlay_DOM);

        //container
        const settingPannel_DOM = document.createElement('div');
        settingPannel_DOM.classList.add('new-goal-panel');
        settingPannel_DOM.classList.add('settings-panel');
        settingPannel_DOM.setAttribute('data-parent-id', parentID);
        document.body.appendChild(settingPannel_DOM);

        //------------Heading
        const panel_heading = document.createElement('h2');
        panel_heading.textContent = 'Create New Goal';
        settingPannel_DOM.appendChild(panel_heading);

        //--------------inputs
        const inputs_container = document.createElement('div');
        inputs_container.classList.add('inputs');
        settingPannel_DOM.appendChild(inputs_container);
        //----left inputs
        const left_inputs_container = document.createElement('div');
        left_inputs_container.classList.add('left');
        inputs_container.appendChild(left_inputs_container);
        //Title
        const title_label = document.createElement('label');
        title_label.textContent = 'Title';
        const title_input = document.createElement('input');
        title_input.setAttribute('type', 'text');
        title_input.setAttribute('name', 'title');
        title_input.setAttribute('placeholder', `Goal Number (${childrenNum + 1})`);
        title_label.appendChild(title_input);
        left_inputs_container.appendChild(title_label);
        //Description
        const description_label = document.createElement('label');
        description_label.textContent = 'Description';
        const description_input = document.createElement('textarea');
        description_input.setAttribute('name', 'description');
        description_label.appendChild(description_input);
        left_inputs_container.appendChild(description_label);
        //note
        const note_label = document.createElement('label');
        note_label.textContent = 'Note';
        const note_input = document.createElement('textarea');
        note_input.setAttribute('name', 'notes');
        note_label.appendChild(note_input);
        left_inputs_container.appendChild(note_label);
        //----right inputs
        const right_inputs_container = document.createElement('div');
        right_inputs_container.classList.add('right');
        inputs_container.appendChild(right_inputs_container);
        //Tags
        const tags_label = document.createElement('label');
        tags_label.textContent = 'Tags';
        const tags_input = document.createElement('input');
        tags_input.setAttribute('type', 'text');
        tags_input.setAttribute('name', 'tags');
        tags_label.appendChild(tags_input);
        right_inputs_container.appendChild(tags_label);
        //DueDate
        const dueDate_label = document.createElement('label');
        dueDate_label.textContent = 'DueDate';
        const dueDate_input = document.createElement('input');
        dueDate_input.setAttribute('type', 'date');
        dueDate_input.setAttribute('name', 'dueDate');
        dueDate_label.appendChild(dueDate_input);
        right_inputs_container.appendChild(dueDate_label);

        //buttons
        const settingPannelControls_DOM = document.createElement('div');
        settingPannelControls_DOM.classList.add('buttons');
        settingPannel_DOM.appendChild(settingPannelControls_DOM);
        const saveBtn_DOM = document.createElement('button');
        saveBtn_DOM.classList.add('create');
        saveBtn_DOM.textContent = 'Create';
        const cancelBtn_DOM = document.createElement('button');
        cancelBtn_DOM.classList.add('cancel');
        cancelBtn_DOM.textContent = 'Cancel';
        settingPannelControls_DOM.appendChild(saveBtn_DOM);
        settingPannelControls_DOM.appendChild(cancelBtn_DOM);
    };
    //TODO: OPTIMIZE
    const drawNewSubGoalPanel = (parentID, childrenNum) => {
        //overlay
        const settingoverlay_DOM = document.createElement('div');
        settingoverlay_DOM.classList.add('overlay');
        document.body.appendChild(settingoverlay_DOM);

        //container
        const settingPannel_DOM = document.createElement('div');
        settingPannel_DOM.classList.add('new-subgoal-panel');
        settingPannel_DOM.classList.add('settings-panel');
        settingPannel_DOM.setAttribute('data-parent-id', parentID);
        document.body.appendChild(settingPannel_DOM);

        //------------Heading
        const panel_heading = document.createElement('h2');
        panel_heading.textContent = 'Create New Sub-Goal';
        settingPannel_DOM.appendChild(panel_heading);

        //--------------inputs
        const inputs_container = document.createElement('div');
        inputs_container.classList.add('inputs');
        settingPannel_DOM.appendChild(inputs_container);
        //----left inputs
        const left_inputs_container = document.createElement('div');
        left_inputs_container.classList.add('left');
        inputs_container.appendChild(left_inputs_container);
        //Title
        const title_label = document.createElement('label');
        title_label.textContent = 'Title';
        const title_input = document.createElement('input');
        title_input.setAttribute('type', 'text');
        title_input.setAttribute('name', 'title');
        title_input.setAttribute('placeholder', `Card Number (${childrenNum + 1})`);
        title_label.appendChild(title_input);
        left_inputs_container.appendChild(title_label);
        //Description
        const description_label = document.createElement('label');
        description_label.textContent = 'Description';
        const description_input = document.createElement('textarea');
        description_input.setAttribute('name', 'description');
        description_label.appendChild(description_input);
        left_inputs_container.appendChild(description_label);
        //note
        const note_label = document.createElement('label');
        note_label.textContent = 'Note';
        const note_input = document.createElement('textarea');
        note_input.setAttribute('name', 'notes');
        note_label.appendChild(note_input);
        left_inputs_container.appendChild(note_label);
        //----right inputs
        const right_inputs_container = document.createElement('div');
        right_inputs_container.classList.add('right');
        inputs_container.appendChild(right_inputs_container);
        //Tags
        const tags_label = document.createElement('label');
        tags_label.textContent = 'Tags';
        const tags_input = document.createElement('input');
        tags_input.setAttribute('type', 'text');
        tags_input.setAttribute('name', 'tags');
        tags_label.appendChild(tags_input);
        right_inputs_container.appendChild(tags_label);
        //DueDate
        const dueDate_label = document.createElement('label');
        dueDate_label.textContent = 'DueDate';
        const dueDate_input = document.createElement('input');
        dueDate_input.setAttribute('type', 'date');
        dueDate_input.setAttribute('name', 'dueDate');
        dueDate_label.appendChild(dueDate_input);
        right_inputs_container.appendChild(dueDate_label);

        //buttons
        const settingPannelControls_DOM = document.createElement('div');
        settingPannelControls_DOM.classList.add('buttons');
        settingPannel_DOM.appendChild(settingPannelControls_DOM);
        const saveBtn_DOM = document.createElement('button');
        saveBtn_DOM.classList.add('create');
        saveBtn_DOM.textContent = 'Create';
        const cancelBtn_DOM = document.createElement('button');
        cancelBtn_DOM.classList.add('cancel');
        cancelBtn_DOM.textContent = 'Cancel';
        settingPannelControls_DOM.appendChild(saveBtn_DOM);
        settingPannelControls_DOM.appendChild(cancelBtn_DOM);
    };

    //TODO: OPTIMIZE
    const drawModificationPanel = (subGoal) => {
        //overlay
        const settingoverlay_DOM = document.createElement('div');
        settingoverlay_DOM.classList.add('overlay');
        document.body.appendChild(settingoverlay_DOM);

        //container
        const settingPannel_DOM = document.createElement('div');
        settingPannel_DOM.classList.add('modify-subgoal-panel');
        settingPannel_DOM.classList.add('settings-panel');
        settingPannel_DOM.setAttribute('data-id', subGoal.ID);
        settingPannel_DOM.setAttribute('data-parent-id', subGoal.ID.slice(0, subGoal.ID.lastIndexOf('-')));
        document.body.appendChild(settingPannel_DOM);

        //------------Heading
        const panel_heading = document.createElement('h2');
        panel_heading.textContent = 'Modify Sub-Goal';
        settingPannel_DOM.appendChild(panel_heading);

        //--------------inputs
        const inputs_container = document.createElement('div');
        inputs_container.classList.add('inputs');
        settingPannel_DOM.appendChild(inputs_container);
        //----left inputs
        const left_inputs_container = document.createElement('div');
        left_inputs_container.classList.add('left');
        inputs_container.appendChild(left_inputs_container);
        //Title
        const title_label = document.createElement('label');
        title_label.textContent = 'Title';
        const title_input = document.createElement('input');
        title_input.setAttribute('type', 'text');
        title_input.setAttribute('name', 'title');
        title_input.setAttribute('value', subGoal.title);
        title_label.appendChild(title_input);
        left_inputs_container.appendChild(title_label);
        //Description
        const description_label = document.createElement('label');
        description_label.textContent = 'Description';
        const description_input = document.createElement('textarea');
        description_input.setAttribute('name', 'description');
        description_input.setAttribute('value', subGoal.descirption);
        description_label.appendChild(description_input);
        left_inputs_container.appendChild(description_label);
        //note
        const note_label = document.createElement('label');
        note_label.textContent = 'Note';
        const note_input = document.createElement('textarea');
        note_input.setAttribute('name', 'notes');
        note_input.setAttribute('value', subGoal.notes);
        note_label.appendChild(note_input);
        left_inputs_container.appendChild(note_label);
        //----right inputs
        const right_inputs_container = document.createElement('div');
        right_inputs_container.classList.add('right');
        inputs_container.appendChild(right_inputs_container);
        //Tags
        const tags_label = document.createElement('label');
        tags_label.textContent = 'Tags';
        const tags_input = document.createElement('input');
        tags_input.setAttribute('type', 'text');
        tags_input.setAttribute('name', 'tags');
        tags_input.setAttribute('value', subGoal.tags);
        tags_label.appendChild(tags_input);
        right_inputs_container.appendChild(tags_label);
        //DueDate
        const dueDate_label = document.createElement('label');
        dueDate_label.textContent = 'DueDate';
        const dueDate_input = document.createElement('input');
        dueDate_input.setAttribute('type', 'date');
        dueDate_input.setAttribute('name', 'dueDate');
        dueDate_input.setAttribute('value', subGoal.dueDate);
        dueDate_label.appendChild(dueDate_input);
        right_inputs_container.appendChild(dueDate_label);

        //--------------inputs
        const actions_container = document.createElement('div');
        actions_container.classList.add('actions');
        settingPannel_DOM.appendChild(actions_container);
        //---delete button
        const deleteButton_DOM = document.createElement('button');
        deleteButton_DOM.classList.add('delete');
        deleteButton_DOM.textContent = 'Delete';
        actions_container.appendChild(deleteButton_DOM);

        //buttons
        const settingPannelControls_DOM = document.createElement('div');
        settingPannelControls_DOM.classList.add('buttons');
        settingPannel_DOM.appendChild(settingPannelControls_DOM);
        const saveBtn_DOM = document.createElement('button');
        saveBtn_DOM.classList.add('modify');
        saveBtn_DOM.textContent = 'Save';
        const cancelBtn_DOM = document.createElement('button');
        cancelBtn_DOM.classList.add('cancel');
        cancelBtn_DOM.textContent = 'Cancel';
        settingPannelControls_DOM.appendChild(saveBtn_DOM);
        settingPannelControls_DOM.appendChild(cancelBtn_DOM);
    };

    const deleteItem_DOM = (targetID_DOM) => {
        document.querySelector(`[data-id="${targetID_DOM}"]`).remove();
    };

    return {
        drawSubGoal,
        updateSubGoal,
        drawGoal,
        updateGoal,
        drawProject,
        updateProject,
        drawNewGoalPanel,
        drawNewSubGoalPanel,
        removePanel,
        drawModificationPanel,
        deleteItem_DOM
    };
})();

export default todoDOM;
