import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchMessages, fetchConversations, createMessage } from '../../redux/actions/messageActions';

import MessageList from '../../components/MessageList/MessageList';

import './Messages.css';
import ConversationList from '../../components/ConversationList/ConversationList';

class MessagesPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            recipient_id: ''
        };
    }

    componentWillMount() {
        this.props.fetchConversations();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.props.userMessages.push(nextProps.newMessage);
        }
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
                <form className="message-form" onSubmit={this.submitMessage}>
                    <input name="content" type="text" value={this.state.content} placeholder="Type your message here..." onChange={this.onChange} />
                    <button type="submit">Send</button>
                </form>
            </React.Fragment>
        );
    }
}

MessagesPage.propTypes = {
    fetchMessages: PropTypes.func.isRequired,
    fetchConversations: PropTypes.func.isRequired,
    createMessage: PropTypes.func.isRequired,
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

export default connect(mapStateToProps, { fetchMessages, fetchConversations, createMessage })(MessagesPage);