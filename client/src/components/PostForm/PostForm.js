import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { createPost } from '../../redux/actions/postActions';

class PostForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: ''
        };
    }

    onSubmit = (e) => {
        e.preventDefault();
        const post = {
            content: this.state.content
        };

        this.props.createPost(post);

        this.setState({ content: '' });
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    render() {
        return (
            <form className="post-form" onSubmit={this.onSubmit}>
                <div className="form-control">
                    <textarea name="content" value={this.state.content} onChange={this.onChange} />
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