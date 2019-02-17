import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';

import { createMessage } from '../../redux/actions/messageActions';

import './MessageForm.css';

class MessageForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: socketIOClient('http://localhost:8081', { query: `token=${localStorage.getItem('token')}` }),
            content: ''
        };
    }

    componentDidMount() {
        this.state.socket.on('sendMessage', (message) => {
            this.props.createMessage(message);
        });
    }

    submitMessage = (e) => {
        e.preventDefault();

        if (this.state.content.trim()) {
            const message = {
                content: this.state.content,
                recipient_id: this.props.recipient_id
            }

            this.state.socket.emit('sendMessage', message);

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
    createMessage: PropTypes.func.isRequired,
    recipient_id: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
    recipient_id: state.messages.recipient_id,
});

export default connect(mapStateToProps, { createMessage })(MessageForm);