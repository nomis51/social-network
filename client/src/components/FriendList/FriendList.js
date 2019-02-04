import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchFriends } from '../../redux/actions/userActions';

import './FriendList.css';

class FriendList extends Component {
    componentWillMount() {
        this.props.fetchFriends();
    }

    render() {
        const friends = this.props.friends.map((f, i) => {
            return (
                <div className="friend-item" key={f._id}>
                    {f.firstName} {f.lastName}
                </div>
            );
        });
        return (
            <div className="friend-list">
                {friends}
            </div>
        );
    }
}

FriendList.propTypes = {
    fetchFriends: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    friends: state.users.friends.items
});

export default connect(mapStateToProps, { fetchFriends })(FriendList);