import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';

const mainNavigation = props => (
    <header className="main-navigation">
        <div className="main-navigation__logo">
            <h1>Social Network</h1>
        </div>
        <nav className="main-navigation__items">
            <ul>
                <React.Fragment>
                    <li>
                        <NavLink to="/login">Login</NavLink>
                    </li>
                    <li>
                        <NavLink to="/signup">Sign up</NavLink>
                    </li>
                </React.Fragment>
                <React.Fragment>
                    <li>
                        <NavLink to="/messages">Messages</NavLink>
                    </li>
                    <li>
                        <NavLink to="/posts">Posts</NavLink>
                    </li>
                    <li>
                        <button>Logout</button>
                    </li>
                </React.Fragment>
            </ul>
        </nav>
    </header>
);

export default mainNavigation;