import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './MainNavigation.css';

import { logout } from '../../redux/actions/authActions';

class MainNavigation extends Component {

    render() {
        return (
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
                                    <button onClick={this.props.logout}>Logout</button>
                                </li>
                            </React.Fragment>
                        </ul>
                    </nav>
                </header>
        );
    }
}

MainNavigation.propTypes = {
    logout: PropTypes.func.isRequired
};

export default connect(null, { logout })(MainNavigation);