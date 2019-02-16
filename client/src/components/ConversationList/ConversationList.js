import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchMessages } from '../../redux/actions/messageActions';

import Conversation from '../Conversation/Conversation';

import './ConversationList.css';

class ConversationList extends Component {
    getMessages = recipient_id => e => {
        e.preventDefault();
        this.setState({
            recipient_id
        });

        this.props.fetchMessages(recipient_id);
    }

    renderConversationList() {
        return this.props.conversations.map((c, i) => {
            return (
                <Conversation recipient={c.recipient} onClick={this.getMessages(c.recipient._id)} key={i} />
            );
        });
    }

    render() {
        return (
            <div className="conversation-list">
                {this.renderConversationList()}
            </div>
        );
    }
}

ConversationList.propTypes = {
    fetchMessages: PropTypes.func.isRequired,
    conversations: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    conversations: state.messages.conversations.items
});

export default connect(mapStateToProps, { fetchMessages })(ConversationList);