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
                <li className="friend" key={f._id}>
                    <img src="https://www.shareicon.net/download/128x128//2015/10/14/656187_cat_512x512.png" alt={f.firstName + '\'s image'} />
                    <p>{f.firstName} {f.lastName}</p>
                </li>
            );
        });
        return (
            <div className="friends">
                <h3>Friends</h3>
                <ul className="friend-list">
                    {friends}
                </ul>
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