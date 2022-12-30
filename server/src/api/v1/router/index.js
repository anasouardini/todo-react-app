const {
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
} = require('../controllers');

const router = require('express').Router();

router.post('/users', createUsers);

router.post('/get/all', readAll);

router.post('/get/workflows', readWorkflows);
router.post('/workflows', createWorkflows);
router.put('/workflows', updateWorkflows);
router.delete('/workflows', deleteWorkflows);

router.post('/get/projects', readProjects);
router.post('/projects', createProjects);
router.put('/projects', updateProjects);
router.delete('/projects', deleteProjects);

router.post('/get/goals', readGoals);
router.post('/goals', createGoals);
router.put('/goals', updateGoals);
router.delete('/goals', deleteGoals);

router.post('/get/subgoals', readSubgoals);
router.post('/subgoals', createSubgoals);
router.put('/subgoals', updateSubgoals);
router.delete('/subgoals', deleteSubgoals);

module.exports = {
    router,
};
