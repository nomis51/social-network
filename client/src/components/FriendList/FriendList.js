import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createMessage } from '../../redux/actions/messageActions';

import './FriendList.css';

class FriendList extends Component {
    render() {
        return (
           <div className="friend-list">

           </div>
        );
    }
}

FriendList.propTypes = {
    fetchFriends: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    friends: state.items
});

export default connect(mapStateToProps, { fetchFriends })(FriendList);