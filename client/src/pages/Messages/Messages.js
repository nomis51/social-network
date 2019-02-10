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
        if (nextProps) {
            this.props.messages.unshift(nextProps.message);
        }
    }

    render() {
        const conversations = this.props.conversations.map((c, i) => {
            return (
                <div className="conversation" key={i}>
                    <p>{c.recipient.firstName}</p>
                </div>
            );
        });

        return (
            <div className="messages">
                {conversations}
            </div>
        );
    }
}

MessagesPage.propTypes = {
    fetchMessages: PropTypes.func.isRequired,
    fetchConversations: PropTypes.func.isRequired,
    messages: PropTypes.array.isRequired,
    conversations: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    messages: state.messages.items,
    conversations: state.messages.conversations.items
});

export default connect(mapStateToProps, { fetchMessages, fetchConversations })(MessagesPage);