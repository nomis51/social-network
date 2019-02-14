import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchMessages, fetchConversations, createMessage } from '../../redux/actions/messageActions';

import './Messages.css';

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

    getMessages = recipient_id => e => {
        e.preventDefault();
        this.setState({
            recipient_id
        });

        this.props.fetchMessages(recipient_id);
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
        const conversations = this.props.conversations.map((c, i) => {
            return (
                <li className="conversation" key={i} onClick={this.getMessages(c.recipient._id)}>
                    <img src="https://www.shareicon.net/download/128x128//2015/10/14/656187_cat_512x512.png" alt={c.recipient.firstName + '\'s image'} />
                    <p>{c.recipient.firstName} {c.recipient.lastName}</p>
                </li>
            );
        });

        let messages = [];

        for (let i = 0, r = 0, u = 0; i < this.props.userMessages.length + this.props.recipientMessages.length; ++i) {
            if (this.props.userMessages.length > u && ((this.props.recipientMessages.length > r && new Date(this.props.userMessages[u].creationTime) < new Date(this.props.recipientMessages[r].creationTime)) || this.props.recipientMessages.length <= r)) {
                messages.push(
                    <li className="message message__user" key={i}>
                        <p>
                            {this.props.userMessages[u].content}<br />
                            <span className="message-time message__user-time">{this.props.userMessages[u].creationTime}</span>
                        </p>
                    </li>
                );
                ++u;
            } else if (this.props.recipientMessages.length > r) {
                messages.push(
                    <li className="message message__recipient" key={i}>
                        <p>
                            {this.props.recipientMessages[r].content}<br />
                            <span className="message-time message__recipient-time">{this.props.recipientMessages[r].creationTime}</span>
                        </p>
                    </li>
                );
                ++r;
            }
        }


        return (
            <React.Fragment>

                <div className="messages row">
                    <div className=" conversation-list col-lg-3">
                        <h3>Conversations</h3>
                        <ul>
                            {conversations}
                        </ul>
                    </div>
                    <div className="message-list col-lg-9">
                        <h3>Messages</h3>
                        <ul>
                            {messages}
                        </ul>
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