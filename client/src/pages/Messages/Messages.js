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
                <li className="conversation" key={i} onClick={this.getMessages(c.recipient._id)}>{c.recipient.firstName}</li>
            );
        });

        return (
            <ul className="messages">
                {conversations}
            </ul>
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