const messageService = require('../message/message.service');

module.exports = {
    types: `
        type Message {
            _id: ID
            content: String!
            creator: User!
            creationTime: String!
            isDeleted: Boolean
        }
    `,
    inputs: `
        input MessageInput {
            content: String!,
            recipient_id: ID 
        }
    `,
    queries: `
        messages: [Message!]!
    `,
    mutations: `
        createMessage(messageInput: MessageInput!): Message
    `,
    resolvers: {
        messages: async (args, req) => {
            if (!req.isAuthenticated) {
                throw new Error('Unauthenticated');
            }

            return await messageService.getAll();
        },
        createMessage: async (args, req) => {
            if (!req.isAuthenticated) {
                throw new Error('Unauthenticated');
            }

            const { content, recipient_id } = args.messageInput;
            return await messageService.create(content, req.user_id, recipient_id);
        }
    }
};