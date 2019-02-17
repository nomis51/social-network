import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';

import { fetchConversations, listenForMessage } from '../../redux/actions/messageActions';

import './Messages.css';

import MessageList from '../../components/MessageList/MessageList';
import ConversationList from '../../components/ConversationList/ConversationList';
import MessageForm from '../../components/MessageForm/MessageForm';

class MessagesPage extends Component {
    componentWillMount() {
        this.props.fetchConversations();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.newMessage && Object.keys(nextProps.newMessage).length !== 0) {
            this.props.userMessages.push(nextProps.newMessage);
        }
    }

    componentDidMount() {
        this.props.listenForMessage();

        const socket = socketIOClient('http://localhost:8081', { query: `token=${localStorage.getItem('token')}` });
        socket.on('newMessage', (message) => {
            this.props.recipientMessages.push(message);
        });

        socket.on('sendMessage', (message) => {
            this.props.userMessages.push(message);
        });
    }

    render() {
        return (
            <React.Fragment>
                <button onClick={this.send}>SEND</button>
                <div className="messages row">
                    <div className="col-lg-3">
                        <h3>Conversations</h3>
                        <ConversationList conversation={this.props.conversations} />
                    </div>
                    <div className="col-lg-9">
                        <h3>Messages</h3>
                        <MessageList userMessages={this.props.userMessages} recipientMessages={this.props.recipientMessages} />
                    </div>
                </div>
                <MessageForm />
            </React.Fragment>
        );
    }
}

MessagesPage.propTypes = {
    fetchConversations: PropTypes.func.isRequired,
    userMessages: PropTypes.array,
    recipientMessages: PropTypes.array,
    conversations: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    userMessages: state.messages.userMessages,
    recipientMessages: state.messages.recipientMessages,
    conversations: state.messages.conversations.items,
    newMessage: state.messages.item,
});

export default connect(mapStateToProps, { fetchConversations, listenForMessage })(MessagesPage);