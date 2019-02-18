import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchConversations } from '../../redux/actions/messageActions';

import './Messages.css';

import MessageList from '../../components/MessageList/MessageList';
import ConversationList from '../../components/ConversationList/ConversationList';
import MessageForm from '../../components/MessageForm/MessageForm';
import Message from '../../components/Message/Message';

class MessagesPage extends Component {
    componentWillMount() {
        this.props.fetchConversations();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            if (nextProps.newMessage && Object.keys(nextProps.newMessage).length !== 0) {
                this.props.userMessages.push(nextProps.newMessage);
            }

            if (nextProps.newRecipientMessage && Object.keys(nextProps.newRecipientMessage).length !== 0) {
                this.props.recipientMessages.push(nextProps.newRecipientMessage);
            }
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="messages row">
                    <div className="col-lg-3">
                        <ConversationList conversation={this.props.conversations} />
                    </div>
                    <div className="col-lg-9">
                        <MessageList userMessages={this.props.userMessages} recipientMessages={this.props.recipientMessages} />
                        {this.props.isRecipientTyping && <Message className="message__recipient" message={{ content: "Recipient is typing...", creationTime: "" }} />}
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
    newMessage: PropTypes.object,
    newRecipientMessage: PropTypes.object,
    isRecipientTyping: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    userMessages: state.messages.userMessages,
    recipientMessages: state.messages.recipientMessages,
    conversations: state.messages.conversations.items,
    newMessage: state.messages.item,
    newRecipientMessage: state.messages.recipientItem,
    isRecipientTyping: state.messages.isRecipientTyping
});

export default connect(mapStateToProps, { fetchConversations })(MessagesPage);