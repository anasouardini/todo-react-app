import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import Router from './router';

import '../styles/index.scss';
// import '../styles/index.css';
import TODO from './todoModule';

//configuration
let darkmode = false;

// load from local storage
TODO.loadSavedWork();

// create some todos
//! outdated function
const createDemo = () => {
    // let workflowID = TODO.create.workflow({title: 'first workflow'});
    let workflowID = TODO.getWork().children[Object.keys(TODO.getWork().children)[1]].ID; //first workflow

    let projectID = TODO.create.project(workflowID, {
        // style: {briefed: 'background: #999;', detailed: 'background: #EEE;', general: 'color: red;'},
        style: '',
        title: 'my wkflw 2 secret project',
        desc: 'little edscription for my secret project',
        dueDate: void 0,
        notes: 'little note',
    });

    let goal1ID = TODO.create.goal(projectID, {tags: [TODO.TAGS.list[1]], styel: '', title: 'Week One Goal'});
    TODO.create.subGoal(goal1ID, {
        tags: [TODO.TAGS.list[0]],
        style: '',
        title: 'My first to-do card in the world',
    });
    TODO.create.subGoal(goal1ID, {
        tags: [TODO.TAGS.list[1]],
        style: '',
        title: 'My second to-do card in the world',
    });
    TODO.create.subGoal(goal1ID, {
        tags: [TODO.TAGS.list[2]],
        style: '',
        title: 'My third to-do card in the world',
    });
    TODO.create.subGoal(goal1ID, {
        tags: [TODO.TAGS.list[2]],
        style: '',
        title: 'My fourth to-do card in the world',
    });

    let goal2ID = TODO.create.goal(projectID, {tags: [TODO.TAGS.list[0]], style: '', title: 'Week Two Goal'});
    TODO.create.subGoal(goal2ID, {
        tags: [TODO.TAGS.list[0]],
        style: '',
        title: 'My first to-do card in the world',
    });
    TODO.create.subGoal(goal2ID, {
        tags: [TODO.TAGS.list[0]],
        style: '',
        title: 'My second to-do card in the world',
    });
    TODO.create.subGoal(goal2ID, {
        tags: [TODO.TAGS.list[0]],
        style: '',
        title: 'My third to-do card in the world',
    });
};

// localStorage.removeItem('workflowsObj');
// createDemo();

//create the root element
const root_DOM = document.createElement('div');
root_DOM.setAttribute('id', 'root');
root_DOM.style.minHeight = '100vh';
document.body.appendChild(root_DOM);

// render the layout inside the root componenet
const root = createRoot(document.querySelector('#root'));
// console.log('index');
root.render(
    // <StrictMode>
    <Router />
    // </StrictMode>
);

//////////////////////// MY LAB
