import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { login } from '../../redux/actions/authActions';

import './Login.css';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.emailEle = React.createRef();
        this.passwordEle = React.createRef();
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const email = this.emailEle.current.value; const password = this.passwordEle.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }


        this.props.login(email, password);
    };

    render() {
        return (
            <form className="login-form" onSubmit={this.handleSubmit}>
                <div className="form-element">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" ref={this.emailEle} />
                </div>
                <div className="form-element">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordEle} />
                </div>
                <div className="form-actions">
                    <button type="submit">Login</button>
                    <Link to="/SignUp">
                        <button type="button">Switch to sign up</button>
                    </Link>
                </div>
            </form>
        );
    }
}

LoginPage.propTypes = {
    login: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { login })(LoginPage);