import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import '../styles/index.scss';
// import '../styles/index.css';

import Router from './router';
import TODO from './todoModule/index';

//create the root element
const root_DOM = document.createElement('div');
root_DOM.setAttribute('id', 'root');
root_DOM.style.minHeight = '100vh';
document.body.appendChild(root_DOM);

// create the rool virtual element
const root = createRoot(document.querySelector('#root'));

// temporarely fix
// TODO.createUser('passhash');

//checking updates and loading localstorage; asyncronously
TODO.loadSavedWork(() => {
    root.render(
        // <StrictMode>
        <Router />
        // </StrictMode>
    );
});

//////////////////////// MY LAB
