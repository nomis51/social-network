import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchMessages } from '../../redux/actions/messageActions';

import './Messages.css';

class MessagesPage extends Component {
    componentWillMount() {
        this.props.fetchMessages();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.props.messages.unshift(nextProps.message);
        }
    }

    render() {
        const messages = this.props.messages.map((m, i) => {
            return (
                <div className="message" key={m._id}>
                    <p>{m.content}</p>
                </div>
            );
        });

        return (
            <div className="messages">
                {messages}
            </div>
        );
    }
}

MessagesPage.propTypes = {
    fetchMessages: PropTypes.func.isRequired,
    messages: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    messages: state.messages.items
});

export default connect(mapStateToProps, { fetchMessages })(MessagesPage);