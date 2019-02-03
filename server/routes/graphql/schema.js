const { buildSchema } = require('graphql');

const messageSchema = require('../message/message.schema');
const userSchema = require('../user/user.schema');
const postSchema = require('../post/post.schema');

module.exports = buildSchema(`
    ${userSchema.types}
    ${messageSchema.types}
    ${postSchema.types}

    ${userSchema.inputs}
    ${messageSchema.inputs}
    ${postSchema.inputs}

    type RootQuery {
        ${userSchema.queries}
        ${messageSchema.queries}
        ${postSchema.queries}
    }

    type RootMutation {
        ${userSchema.mutations}
        ${messageSchema.mutations}
        ${postSchema.mutations}
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);