import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchMessages, fetchConversations } from '../../redux/actions/messageActions';

import './Messages.css';

class MessagesPage extends Component {
    componentWillMount() {
        this.props.fetchConversations();
    }

    componentWillReceiveProps(nextProps) {

    }

    getMessages = recipient_id => e => {
        e.preventDefault();
        this.props.fetchMessages(recipient_id);
    }

    render() {
        const conversations = this.props.conversations.map((c, i) => {
            return (
                <li className="conversation" key={i} onClick={this.getMessages(c.recipient._id)}>
                    <img src="https://www.shareicon.net/download/128x128//2015/10/14/656187_cat_512x512.png" alt={c.recipient.firstName + '\'s image'} />
                    <p>{c.recipient.firstName} {c.recipient.lastName}</p>
                </li>
            );
        });

        let messages = [];
        console.log(this.props.userMessages)
        console.log(this.props.recipientMessages)

        for (let i = 0, r = 0, u = 0; i < this.props.userMessages.length + this.props.recipientMessages.length; ++i) {
            if (this.props.userMessages.length > u && ((this.props.recipientMessages.length > r && new Date(this.props.userMessages[u].creationTime) < new Date(this.props.recipientMessages[r].creationTime)) || this.props.recipientMessages.length <= r)) {
                messages.push(
                    <li className="message message__user" key={i}>
                        <p>{this.props.userMessages[u].content}<br />{this.props.userMessages[u].creationTime}</p>
                    </li>
                );
                ++u;
            } else if (this.props.recipientMessages.length > r) {
                messages.push(
                    <li className="message message__recipient" key={i}>
                        <p>{this.props.recipientMessages[r].content}<br />{this.props.recipientMessages[r].creationTime}</p>
                    </li>
                );
                ++r;
            }
        }


        return (
            <div className="messages">
                <ul className="conversation-list">
                    {conversations}
                </ul>
                <div className="message-list">
                    <h3>Messages</h3>
                    <ul>
                        {messages}
                    </ul>
                </div>
            </div>
        );
    }
}

MessagesPage.propTypes = {
    fetchMessages: PropTypes.func.isRequired,
    fetchConversations: PropTypes.func.isRequired,
    userMessages: PropTypes.array,
    recipientMessages: PropTypes.array,
    conversations: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    userMessages: state.messages.userMessages,
    recipientMessages: state.messages.recipientMessages,
    conversations: state.messages.conversations.items
});

export default connect(mapStateToProps, { fetchMessages, fetchConversations })(MessagesPage);