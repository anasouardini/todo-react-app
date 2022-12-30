const {createUsers} = require('./controllers/users');
const {readAll} = require('./controllers/all');
const {
    createWorkflows,
    readWorkflows,
    updateWorkflows,
    deleteWorkflows,
} = require('./controllers/workflows');
const {
    createProjects,
    readProjects,
    updateProjects,
    deleteProjects,
} = require('./controllers/projects');
const {createGoals, readGoals, updateGoals, deleteGoals} = require('./controllers/goals');
const {
    createSubgoals,
    readSubgoals,
    updateSubgoals,
    deleteSubgoals,
} = require('./controllers/subgoals');

//! so fucking bloated
module.exports = {
    createUsers,
    createWorkflows,
    createProjects,
    createGoals,
    createSubgoals,

    readAll,
    readWorkflows,
    readProjects,
    readGoals,
    readSubgoals,

    updateWorkflows,
    updateProjects,
    updateGoals,
    updateSubgoals,

    deleteWorkflows,
    deleteProjects,
    deleteGoals,
    deleteSubgoals,
};
