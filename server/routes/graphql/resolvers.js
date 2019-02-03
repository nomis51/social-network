const userSchema = require('../user/user.schema');
const messageSchema = require('../message/message.schema');
const postSchema = require('../post/post.schema');

module.exports = {
    ...userSchema.resolvers,
    ...messageSchema.resolvers,
    ...postSchema.resolvers
}