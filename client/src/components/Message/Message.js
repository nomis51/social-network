import React, { Component } from 'react';

import './Message.css';

class Message extends Component {
    render() {
        return (
            <div className={"message " + this.props.className}>
                <p>
                    {this.props.message.content}<br />
                    <span className={`message-time ${this.props.className}-time`}>{this.props.message.creationTime}</span>
                </p>
            </div>
        );
    }
}

export default Message;