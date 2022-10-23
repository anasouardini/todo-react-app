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
root.render(
    // <StrictMode>
    <Router />
    // </StrictMode>
);

//////////////////////// MY LAB
