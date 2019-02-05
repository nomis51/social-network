const validator = require('../schemaValidator');
const uniqid = require('uniqid');

const Post = {
    schema: {
        _id: {
            type: 'string',
            default: () => uniqid()
        },
        content: {
            type: 'string',
            required: true,
            validation: (value) => {
                return value.length >= 1 && value.length <= 140;
            }
        },
        isDeleted: {
            type: 'boolean',
            default: () => false
        },
        creationTime: {
            type: 'string',
            default: () => (new Date).toISOString()
        },
        lastUpdateTime: {
            type: 'string',
            default: () => undefined
        },
        creator: {
            type: 'object',
            default: () => undefined
        }
    },
    validate: (post) => {
        return validator(post, Post.schema);
    },
    create: (content) => {
        const post = {
            content
        };

        let validatedPost = Post.validate(post);
        validatedPost.lastUpdateTime = validatedPost.creationTime;

        return validatedPost ? validatedPost : null;
    }
};

module.exports = Post;