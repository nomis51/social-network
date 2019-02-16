import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createMessage } from '../../redux/actions/messageActions';

import './MessageForm.css';

class MessageForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            recipient_id: ''
        };
    }

    submitMessage = (e) => {
        e.preventDefault();

        if (this.state.content.trim()) {
            const message = {
                content: this.state.content,
                recipient_id: this.state.recipient_id
            }

            this.props.createMessage(message);

            this.setState({
                content: ''
            });
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <form className="message-form" onSubmit={this.submitMessage}>
                <input name="content" type="text" value={this.state.content} placeholder="Type your message here..." onChange={this.onChange} />
                <button type="submit">Send</button>
            </form>
        );
    }
}

MessageForm.propTypes = {
    createMessage: PropTypes.func.isRequired
};

export default connect(null, { createMessage })(MessageForm);