//TODO: BASIC and MUST
//* add profile/project
//* remove goal/profile/project
//TODO: COOL and OPTIONAL
//* more info in goals&subgoals
//* timer
//* links
//* backgrounds/imageHeading
//* accounts/auth & storage
//* github sync(links that takes you to exact piece of code you wanna change, etc)

import '../styles/index.scss';
import TODO from './to-do';

//load previous work
TODO.loadSavedWork();
TODO.showSavedWork();
// TODO.burnWork();

// console.log(TODO.TAGS.list);

// let profileID = TODO.createProfile('defaultProfile');
// let projectID = TODO.createProject(profileID, void 0, 'my secret project', 'little edscription for my secret project', void 0, 'little note');
// let goal1ID = TODO.createGoal(profileID, projectID, [TODO.TAGS.list[1]], {}, 'Week One Goal');
// TODO.createSubGoal(profileID, projectID, goal1ID, [TODO.TAGS.list[0]], {}, 'My first to-do card in the world');
// TODO.createSubGoal(profileID, projectID, goal1ID, [TODO.TAGS.list[1]], {}, 'My second to-do card in the world');
// TODO.createSubGoal(profileID, projectID, goal1ID, [TODO.TAGS.list[2]], {}, 'My third to-do card in the world');
// TODO.createSubGoal(profileID, projectID, goal1ID, [TODO.TAGS.list[2]], {}, 'My fourth to-do card in the world');
// let goal2ID = TODO.createGoal(profileID, projectID, [TODO.TAGS.list[0]], {}, 'Week Two Goal');
// TODO.createSubGoal(profileID, projectID, goal2ID, [TODO.TAGS.list[0]], {}, 'My first to-do card in the world');
// TODO.createSubGoal(profileID, projectID, goal2ID, [TODO.TAGS.list[0]], {}, 'My second to-do card in the world');
// TODO.createSubGoal(profileID, projectID, goal2ID, [TODO.TAGS.list[0]], {}, 'My third to-do card in the world');

// TODO.DOM.drawProject(TODO.getItemByID(projectID), document.querySelector('.project-board'));

const prjectID_DOM = document.querySelector('.project-container').getAttribute('data-id');
document.addEventListener('click', (e) => {
    if (e.target == document.querySelector('.add-new-goal')) {
        TODO.DOM.drawNewGoalPanel(prjectID_DOM, Object.keys(TODO.getItemByID(prjectID_DOM).children).length);
    } else if (e.target.classList.contains('add-new-subgoal')) {
        const goalID_DOM = e.target.getAttribute('data-id');
        TODO.DOM.drawNewSubGoalPanel(e.target.getAttribute('data-id'), Object.keys(TODO.getItemByID(goalID_DOM).children).length);
    } else if (e.target == document.querySelector('.overlay') || e.target == document.querySelector('.settings-panel button.cancel')) {
        TODO.DOM.removePanel();
    } else if (e.target == document.querySelector('.settings-panel button.create')) {
        let title = document.querySelector('.settings-panel input[name="title"]').value;
        if (title == '') {
            title = document.querySelector('.settings-panel input[name="title"]').getAttribute('placeholder');
        }
        const dseciption = document.querySelector('.settings-panel textarea[name="description"]').value;
        const dueDate = document.querySelector('.settings-panel input[name="dueDate"]').value;
        const notes = document.querySelector('.settings-panel textarea[name="notes"]').value;

        if (e.target == document.querySelector('.new-goal-panel button.create')) {
            const goalID = TODO.createGoal(profileID, prjectID_DOM, [], {}, title, dseciption, 'undefined', dueDate);
            TODO.DOM.drawGoal(TODO.getItemByID(goalID), document.querySelector(`div[data-id="${prjectID_DOM}"]`));
        } else if (e.target == document.querySelector('.new-subgoal-panel button.create')) {
            const goalID_DOM = e.target.closest('.settings-panel').getAttribute('data-parent-id');
            const subGoalID = TODO.createSubGoal(profileID, prjectID_DOM, goalID_DOM, [], {}, title, dseciption, 'undefined', dueDate);
            TODO.DOM.drawSubGoal(TODO.getItemByID(subGoalID), document.querySelector(`div[data-id="${goalID_DOM}"]`));
        }

        TODO.DOM.removePanel();
    } else if (e.target.classList.contains('card')) {
        const subGoal = TODO.getItemByID(e.target.getAttribute('data-id'));
        // console.log('parent', TODO.getItemByID(e.target.closest('.cards-container').getAttribute('data-id')));
        // console.log('subgoal', subGoal);
        // console.log('id', e.target.getAttribute('data-id'));
        TODO.DOM.drawModificationPanel(subGoal);
    } else if (e.target == document.querySelector('.settings-panel button.modify')) {
        const title = document.querySelector('.settings-panel input[name="title"]').value;
        const dseciption = document.querySelector('.settings-panel textarea[name="description"]').value;
        const notes = document.querySelector('.settings-panel textarea[name="notes"]').value;
        const dueDate = document.querySelector('.settings-panel input[name="dueDate"]').value;

        // console.log(e.target.closest('.settings-panel'));
        const item = TODO.getItemByID(e.target.closest('.settings-panel').getAttribute('data-id'));
        if (e.target == document.querySelector('.modify-subgoal-panel button.modify')) {
            //modify sub-goal
            TODO.modifyItem(item, title, dseciption, notes, [], dueDate);
        } else if (e.target == document.querySelector('.modify-goal-panel button.modify')) {
            //modify goal
            TODO.modifyItem(item, title, dseciption, notes, [], dueDate);
        }

        TODO.DOM.removePanel();
        const itemParent_DOM = document.querySelector(`[data-id="${e.target.closest('.settings-panel').getAttribute('data-parent-id')}"]`);
        TODO.DOM.updateSubGoal(item, itemParent_DOM);
        // console.log(TODO.getItemByID(e.target.closest('.settings-panel').getAttribute('data-parent-id')));
    } else if (e.target == document.querySelector('.settings-panel button.delete')) {
        const targetID = e.target.closest('.settings-panel').getAttribute('data-id');
        TODO.deleteItemByID(targetID); //delete form the object
        TODO.DOM.deleteItem_DOM(targetID); //delete from the UI
        TODO.DOM.removePanel();
        // console.log(TODO.getItemByID(e.target.closest('.settings-panel').getAttribute('data-parent-id')));
    }
});

document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('card')) {
        e.target.setAttribute('data-beingDragged', 'true');
        [...document.querySelectorAll('.cards-container')].forEach((cardContainer) => {
            [...cardContainer.children].forEach((card) => {
                card.style.pointerEvents = 'none';
            });
        });
    }
});

document.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('card') && e.target.hasAttribute('data-beingDragged')) {
        e.target.removeAttribute('data-beingDragged');

        const draggedCardID = e.target.getAttribute('data-id');
        const draggedCardNewParentID = e.target.closest('.cards-container').getAttribute('data-id');
        // console.log(draggedCardNewParentID);
        const newID = TODO.moveItem(draggedCardID, draggedCardNewParentID);
        e.target.setAttribute('data-id', newID);
        [...document.querySelectorAll('.cards-container')].forEach((cardContainer) => {
            [...cardContainer.children].forEach((card) => {
                card.style.pointerEvents = 'auto';
            });
        });
    }
});

document.addEventListener('dragover', (e) => {
    if (e.target.classList.contains('cards-container') && !e.target.classList.contains('empty-cards-container')) {
        const cards = [...e.target.children].filter((child) => child.classList.contains('card'));
        const afterElm = cards.reduce(
            (prev, current) => {
                const currentRect = current.getBoundingClientRect();
                const distance = e.clientY - (currentRect.bottom - (currentRect.bottom - currentRect.top) / 2);

                if (distance > 0 && prev.distance > distance) {
                    return {distance, elm: current};
                } else {
                    return prev;
                }
            },
            {distance: +Infinity, elm: undefined}
        );

        if (afterElm.elm) {
            afterElm.elm.after(document.querySelector('[data-beingDragged]'));
        } else {
            cards[0].before(document.querySelector('[data-beingDragged]'));
        }
    }
});
