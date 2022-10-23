import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import Router from './router';

import '../styles/index.scss';
// import '../styles/index.css';
import TODO from './todoModule';

// load from local storage
TODO.loadSavedWork();

// localStorage.removeItem('workflowsObj');

//create the root element
const root_DOM = document.createElement('div');
root_DOM.setAttribute('id', 'root');
root_DOM.style.minHeight = '100vh';
document.body.appendChild(root_DOM);

// render the layout inside the root componenet
const root = createRoot(document.querySelector('#root'));
// console.log('index');
// root.render(
//     // <StrictMode>
//     <Router />
//     // </StrictMode>
// );

//////////////////////// MY LAB
// WRITE
const createUser = () => {
    const data = {
        data: {
            username: 'bliyla',
            password: 'bliyla',
        },
    };
    const options = {
        method: 'post',
        headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        cache: 'default',
    };

    fetch('http://127.0.0.1:2000/api/users', options)
        .then((res) => {
            console.log(res);
            res.json()
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

const createWorkflow = () => {
    const data = {
        data: {
            title: 'new workflow',
            desc: 'workflow description',
            notes: 'nothing to note',
        },
    };
    const options = {
        method: 'post',
        headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        cache: 'default',
    };

    fetch('http://127.0.0.1:2000/api/workflows', options)
        .then((res) => {
            console.log(res);
            res.json()
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

const createProject = () => {
    const data = {
        data: {
            title: 'new project',
            desc: 'project description',
            notes: 'nothing to note',
            dueDate: '2017-11-01T00:00:00',
            priority: 1,
            tags: '1',
        },
    };
    const options = {
        method: 'post',
        headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        cache: 'default',
    };

    fetch('http://127.0.0.1:2000/api/projects', options)
        .then((res) => {
            console.log(res);
            res.json()
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

const createGoal = () => {
    const data = {
        data: {
            title: 'new Goal',
            desc: 'Goal description',
            notes: 'nothing to note',
            dueDate: '2017-11-01T00:00:00',
            priority: 1,
            order: 0,
            tags: '1',
        },
    };
    const options = {
        method: 'post',
        headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        cache: 'default',
    };

    fetch('http://127.0.0.1:2000/api/goals', options)
        .then((res) => {
            console.log(res);
            res.json()
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

const createSubgoal = () => {
    const data = {
        data: {
            title: 'new Suboal',
            desc: 'Suboal description',
            notes: 'nothing to note',
            dueDate: '2017-11-01T00:00:00',
            priority: 1,
            order: 0,
            tags: '1',
        },
    };
    const options = {
        method: 'post',
        headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        cache: 'default',
    };

    fetch('http://127.0.0.1:2000/api/subgoals', options)
        .then((res) => {
            console.log(res);
            res.json()
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

// READ
const getWorkFlows = () => {
    fetch('http://127.0.0.1:2000/api/workflows?id=98483c9b-9ad6-43cd-a8d7-7aadb43bb5ba')
        .then((res) => {
            res.json()
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
};
let oldD = 0;
const getProjects = () => {
    const d = new Date();
    oldD = d.getTime();

    fetch('http://127.0.0.1:2000/api/1/projects?id=2')
        .then((res) => {
            res.json()
                .then((res) => {
                    console.log(res);
                    const d = new Date();
                    console.log('trip', d.getTime() - oldD);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

const getGoals = () => {
    const d = new Date();
    oldD = d.getTime();

    fetch('http://127.0.0.1:2000/api/1/goals?id=2')
        .then((res) => {
            res.json()
                .then((res) => {
                    console.log(res);
                    const d = new Date();
                    console.log('trip', d.getTime() - oldD);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

const getSubgoals = () => {
    const d = new Date();
    oldD = d.getTime();

    fetch('http://127.0.0.1:2000/api/1/subgoals?id=2')
        .then((res) => {
            res.json()
                .then((res) => {
                    console.log(res);
                    const d = new Date();
                    console.log('trip', d.getTime() - oldD);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

// UPDATE
const modifyWorkflow = () => {
    fetch('http://127.0.0.1:2000/api/workflows?id=98483c9b-9ad6-43cd-a8d7-7aadb43bb5ba?title=new t', {
        method: 'put',
        headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json',
        },
        cache: 'default',
        body: JSON.stringify({title: 'new t'}),
    })
        .then((res) => {
            res.json()
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
};

// createUser();
// createWorkflow();

// getWorkFlows();

modifyWorkflow();
