import React, { Component } from 'react';

import Message from '../Message/Message';

import './MessageList.css';

class MessageList extends Component {
    renderMessageList() {
        let messages = [];

        for (let i = 0, r = 0, u = 0; i < this.props.userMessages.length + this.props.recipientMessages.length; ++i) {
            if (this.props.userMessages.length > u && ((this.props.recipientMessages.length > r && new Date(this.props.userMessages[u].creationTime) < new Date(this.props.recipientMessages[r].creationTime)) || this.props.recipientMessages.length <= r)) {
                messages.push(
                    <Message message={this.props.userMessages[u]} className="message__user" key={i} />
                );
                ++u;
            } else if (this.props.recipientMessages.length > r) {
                messages.push(
                    <Message message={this.props.recipientMessages[r]} className="message__recipient" key={i} />
                );
                ++r;
            }
        }

        return messages;
    }

    render() {
        return (
            <div className="message-list">
                {this.renderMessageList()}
            </div>
        );
    }
}

export default MessageList;