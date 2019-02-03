import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createMessage } from '../../redux/actions/messageActions';

import './MessageForm.css';

class MessageForm extends Component {
    onSubmit(e) {
        e.preventDefault();
        const message = {
            content: this.state.content,
            recipient_id: this.state.recipient_id
        };

        this.props.createMessage(message);
    }

    render() {
        return (
            <form className="message-form" onSubmit={this.onSubmit}>
                <div className="form-control">
                    <textarea name="content" />
                </div>
                <div class="form-action">
                    <button type="submit">Send</button>
                </div>
            </form>
        );
    }
}

MessageForm.propTypes = {
    createMessage: PropTypes.func.isRequired
};

export default connect(null, { createMessage })(MessageForm);