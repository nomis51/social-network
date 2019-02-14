import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './SignUp.css';

class SignUpPage extends Component {

    constructor(props) {
        super(props);
        this.firstNameEle = React.createRef();
        this.lastNameEle = React.createRef();
        this.emailEle = React.createRef();
        this.passwordEle = React.createRef();
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const firstName = this.firstNameEle.current.value;
        const lastName = this.lastNameEle.current.value;
        const email = this.emailEle.current.value;
        const password = this.passwordEle.current.value;

        const reqBody = {
            query: `
                mutation {
                    createUser(userInput:{
                        firstName: "${firstName}",
                        lastName: "${lastName}",
                        email: "${email}",
                        password: "${password}"
                    }) {
                        firstName,
                        lastName
                    }
                }
            `
        };

        fetch('http://localhost:8081/api/graphql', {
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Sign up failed');
                }

                return res.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        return (
            <form className="signup-forn" onSubmit={this.handleSubmit}>
                <div className="form-element">
                    <label htmlFor="firstName">First name</label>
                    <input type="text" id="firstName" ref={this.firstNameEle} />
                </div>
                <div className="form-element">
                    <label htmlFor="lastName">Last name</label>
                    <input type="text" id="lastName" ref={this.lastNameEle} />
                </div>
                <div className="form-element">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" ref={this.emailEle} />
                </div>
                <div className="form-element">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordEle} />
                </div>
                <div className="form-actions">
                    <button type="submit">Sign up</button>
                    <Link to="/Login">
                        <button type="button">Switch to login</button>
                    </Link>
                </div>
            </form>
        );
    }
}

export default SignUpPage;