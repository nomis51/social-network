import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import socketIOClient from 'socket.io-client';

import { fetchFriends } from '../../redux/actions/userActions';

import './FriendList.css';

class FriendList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            socket: socketIOClient('http://localhost:8081', { query: `token=${sessionStorage.getItem('token')}` }),
            content: '',
            friendStatus: new Map()
        };
    }

    componentWillMount() {
        this.props.fetchFriends();
    }

    componentDidMount() {
        this.setState({
            friends: this.props.friends
        });

        this.state.socket.on('friendConnection', (friend) => {
            const { friendStatus } = this.state;
            if (!this.state.friendStatus.get(friend.friend_id)) {
                friendStatus.set(friend.friend_id, 1);
            }
            this.setState({ friendStatus });
        });

        this.state.socket.on('friendDisconnection', (friend) => {
            const { friendStatus } = this.state;
            if (this.state.friendStatus.get(friend.friend_id)) {
                this.state.friendStatus.delete(friend.friend_id);
            }
            this.setState({ friendStatus });
        });

        this.state.socket.on('onlineFriends', (friends) => {
            const { friendStatus } = this.state;
            friends.forEach(f => {
                if (!this.state.friendStatus.get(f._id)) {
                    this.state.friendStatus.set(f._id, 1);
                }
            });
            this.setState({ friendStatus });
        });
    }

    render() {
        const friends = this.props.friends.map((f, i) => {
            return (
                <li className="friend" key={f._id}>
                    {this.state.friendStatus.get(f._id) && <div className="online-dot"></div>}
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