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
        const messages = this.props.messages.map(message => {
            return (
                <div className="message">
                    <p>{messages.content}</p>
                </div>
            );
        });

        return (
            { messages }
        );
    }
}

MessagesPage.propTypes = {
    fetchMessages: PropTypes.func.isRequired,
    messages: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    messages: state.items
});

export default connect(mapStateToProps, { fetchMessages })(MessagesPage);