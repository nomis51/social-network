import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchConversations } from '../../redux/actions/messageActions';

import './Messages.css';

import MessageList from '../../components/MessageList/MessageList';
import ConversationList from '../../components/ConversationList/ConversationList';
import MessageForm from '../../components/MessageForm/MessageForm';

class MessagesPage extends Component {
    componentWillMount() {
        this.props.fetchConversations();
    }

    componentWillReceiveProps(nextProps) {
        console.log('HERER')
        if (nextProps && nextProps.newMessage && Object.keys(nextProps.newMessage).length !== 0) {
            this.props.userMessages.push(nextProps.newMessage);
        }
    }

    render() {
        return (
            <React.Fragment>
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
    conversations: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    userMessages: state.messages.userMessages,
    recipientMessages: state.messages.recipientMessages,
    conversations: state.messages.conversations.items,
    newMessage: state.messages.item
});

export default connect(mapStateToProps, { fetchConversations })(MessagesPage);