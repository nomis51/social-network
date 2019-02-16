import React, { Component } from 'react';

import './Conversation.css';

class Conversation extends Component {
    render() {
        return (
            <div className="conversation" onClick={this.props.onClick}>
                <img src="https://www.shareicon.net/download/128x128//2015/10/14/656187_cat_512x512.png" alt={this.props.recipient.firstName + '\'s image'} />
                <p>{this.props.recipient.firstName} {this.props.recipient.lastName}</p>
            </div>
        );
    }
}

export default Conversation;