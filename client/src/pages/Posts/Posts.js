import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './Posts.css';

import PostForm from './../../components/PostForm/PostForm';
import { fetchPosts } from './../../redux/actions/postActions';

class PostsPage extends Component {
    componentWillMount() {
        this.props.fetchPosts();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.props.posts.unshift(nextProps.newPost);
        }
    }

    render() {
        const posts = this.props.posts.map((p, i) => {
            return (
                <div className="post" key={i}>
                    <h4>{p.creator.firstName}</h4>
                    <p>{p.content}</p>
                </div>
            );
        });

        return (
            <div>
                <PostForm />
                <h1>Posts</h1>
                {posts}
            </div>
        );
    }
}

PostsPage.propTypes = {
    fetchPosts: PropTypes.func.isRequired,
    posts: PropTypes.array.isRequired,
    newPost: PropTypes.object
};

const mapStateToProps = state => ({
    posts: state.posts.items,
    newPost: state.posts.item
});

export default connect(mapStateToProps, { fetchPosts })(PostsPage)