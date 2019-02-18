import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchMessages, setRecipient } from '../../redux/actions/messageActions';

import Conversation from '../Conversation/Conversation';

import './ConversationList.css';

class ConversationList extends Component {
    getMessages = recipient => e => {
        e.preventDefault();

        this.props.setRecipient(recipient);
        this.props.fetchMessages(recipient._id);
    }

    renderConversationList() {
        return this.props.conversations.map((c, i) => {
            return (
                <Conversation recipient={c.recipient} onClick={this.getMessages(c.recipient)} key={i} />
            );
        });
    }

    render() {
        return (
            <div className="conversation-list">
                <h3>Conversations</h3>
                {this.renderConversationList()}
            </div>
        );
    }
}

ConversationList.propTypes = {
    fetchMessages: PropTypes.func.isRequired,
    setRecipient: PropTypes.func.isRequired,
    conversations: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    conversations: state.messages.conversations.items
});

export default connect(mapStateToProps, { fetchMessages, setRecipient })(ConversationList);