import React, {Component} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import MainLayout from './components/shared/mainLayout';

import Home from './pages/home';
import Work from './pages/work';
import Project from './pages/project';

export default function Router() {
    // console.log('router');
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="project/:ID" element={<Project />} />
                    <Route path="work" element={<Work />} />
                </Route>
                <Route path="*" element={<h1>404</h1>} />
            </Routes>
        </BrowserRouter>
    );
}
