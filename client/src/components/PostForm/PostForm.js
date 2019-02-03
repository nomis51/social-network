import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createPost } from '../../redux/actions/postActions';

class PostForm extends Component {
    onSubmit = (e) => {
        e.preventDefault();
        const post = {
            content: 'New post'
        };

        this.props.createPost(post);
    }

    render() {
        return (
            <form className="post-form" onSubmit={this.onSubmit}>
                <div className="form-control">
                    <textarea name="content" />
                </div>
                <div className="post-action">
                    <button type="submit">Share</button>
                </div>
            </form>
        );
    }
}

PostForm.propTypes = {
    createPost: PropTypes.func.isRequired
};

export default connect(null, { createPost })(PostForm);