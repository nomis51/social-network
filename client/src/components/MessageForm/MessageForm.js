import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';

import { createMessage, addNewRecipientMessage, setIsRecipientTyping } from '../../redux/actions/messageActions';

import './MessageForm.css';

class MessageForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: socketIOClient('http://localhost:8081', { query: `token=${sessionStorage.getItem('token')}` }),
            content: '',
        };
    }

    componentDidMount() {
        this.state.socket.on('sendMessage', (message) => {
            this.props.createMessage(message);
        });

        this.state.socket.on('newMessage', (message) => {
            this.props.addNewRecipientMessage(message);
        });

        this.state.socket.on('recipientTyping', () => {
            if (!this.props.isRecipientTyping) {
                this.props.setIsRecipientTyping(true);

                setTimeout(() => {
                    this.props.setIsRecipientTyping(false);
                }, 3000);
            }
        });
    }

    submitMessage = (e) => {
        e.preventDefault();

        if (this.state.content.trim()) {
            const message = {
                content: this.state.content,
                recipient_id: this.props.recipient._id
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
console.log(this.props)
        this.state.socket.emit('typing', this.props.recipient._id);
    }

    render() {
        return (
            <form className="message-form" onSubmit={this.submitMessage}>
                <div className="row">
                    <div className="form-element col-lg-9">
                        <input name="content" type="text" value={this.state.content} placeholder="Type your message here..." onChange={this.onChange} />
                    </div>
                    <div className="form-action col-lg-3">
                        <button type="submit">Send</button>
                    </div>
                </div>
            </form>
        );
    }
}

MessageForm.propTypes = {
    createMessage: PropTypes.func.isRequired,
    addNewRecipientMessage: PropTypes.func.isRequired,
    recipient: PropTypes.object.isRequired,
    setIsRecipientTyping: PropTypes.func.isRequired,
    isRecipientTyping: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    recipient: state.messages.recipient,
    isRecipientTyping: state.messages.isRecipientTyping
});

export default connect(mapStateToProps, { createMessage, addNewRecipientMessage, setIsRecipientTyping })(MessageForm);