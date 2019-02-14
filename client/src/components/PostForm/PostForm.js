import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createPost } from '../../redux/actions/postActions';

import './PostForm.css';

class PostForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: '',
            contentError: false
        };
    }

    onSubmit = (e) => {
        e.preventDefault();
        if (this.state.content && this.state.content.trim() !== '') {
            const post = {
                content: this.state.content
            };

            this.props.createPost(post);

            this.setState({ content: '', contentError: false });
        } else {
            this.setState({ contentError: true });
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <form className="post-form" onSubmit={this.onSubmit}>
                <h3>Share a new post</h3>
                {this.state.contentError && <h5 className="error-message">Please provide a content for your post</h5>}
                <div className="form-element">
                    <textarea placeholder="Your post content here..." name="content" value={this.state.content} onChange={this.onChange} />
                </div>
                <div className="form-action">
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