import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import MainNavigation from './components/Navigation/MainNavigation';
import LoginPage from './pages/Login/Login';
import MessagesPage from './pages/Messages/Messages';
import SignUpPage from './pages/SignUp/SignUp';
import PostsPage from './pages/Posts/Posts';

class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <React.Fragment>
                    <MainNavigation />
                    <main className="main-content">
                        <React.Fragment>
                            <Switch>
                                {this.props.auth.token && <Redirect from="/" to="/messages" exact />}
                                {this.props.auth.token && <Redirect from="/login" to="/posts" />}

                                {!this.props.auth.token && <Route path="/login" component={LoginPage} />}
                                {this.props.auth.token && <Route path="/posts" component={PostsPage} />}
                                {this.props.auth.token && <Route path="/messages" component={MessagesPage} />}
                                {!this.props.auth.token && <Route path="/signup" component={SignUpPage} />}

                                {!this.props.auth.token && <Redirect to="/login" exact />}
                            </Switch>
                        </React.Fragment>
                    </main>
                </React.Fragment>
            </BrowserRouter>
        );
    }
}


Router.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, {})(Router);