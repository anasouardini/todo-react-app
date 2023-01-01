import React from 'react';
import {NavLink, Outlet} from 'react-router-dom';

export default function MainLayout() {
    return (
        <>
            <header>
                <nav>
                    <NavLink to="/" style={({isActive}) => (isActive ? {color: 'red'} : {})}>
                        {' '}
                        Home
                    </NavLink>
                    <NavLink to="/work" style={({isActive}) => (isActive ? {color: 'red'} : {})}>
                        Work
                    </NavLink>
                </nav>
            </header>

            <Outlet />

            <div className="footer">
                <h2>this is a footer</h2>
            </div>
        </>
    );
}
