import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import Work from './pages/work';
import Project from './pages/projectPage';

export default function Router() {
    // console.log('router');
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Work />} />
                <Route path='project/:ID' element={<Project />} />
                <Route path='*' element={<h1>404</h1>} />
            </Routes>
        </BrowserRouter>
    );
}
