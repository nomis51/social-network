const postService = require('./post.service');

module.exports = {
    types: `
        type Post {
            _id: ID
            content: String!
            creator: User!
            creationTime: String!
            lastUpdateTime: String
            isDeleted: Boolean
        }
    `,
    inputs: `
      
    `,
    queries: `
        posts: [Post!]!
    `,
    mutations: `
        createPost(content: String!): Post
    `,
    resolvers: {
        posts: async (args, req) => {
            if (!req.isAuthenticated) {
                throw new Error('Unauthenticated');
            }

            return await postService.getAll();
        },
        createPost: async (args, req) => {
            if (!req.isAuthenticated) {
                throw new Error('Unauthenticated');
            }

            const { content } = args;
            return await postService.create(content, req.user_id);
        }
    }
};