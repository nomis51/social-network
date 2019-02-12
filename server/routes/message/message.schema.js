const messageService = require('../message/message.service');

module.exports = {
    types: `
        type Message {
            _id: ID
            content: String!
            creator: User!
            creationTime: String!
        }
            
        type Conversation {
            recipient: User!
            user: User!
        }

        type ConversationMessages {
            userMessages: [Message!]!
            recipientMessages: [Message!]!
        }
    `,
    inputs: `
        input MessageInput {
            content: String!,
            recipient_id: ID 
        }
    `,
    queries: `
        messages(recipient_id: String!): ConversationMessages!,
        conversations: [Conversation!]!
    `,
    mutations: `
        createMessage(messageInput: MessageInput!): Message
    `,
    resolvers: {
        messages: async (args, req) => {
            if (!req.isAuthenticated) {
                throw new Error('Unauthenticated');
            }

            const { recipient_id } = args;
            const { user_id } = req;

            return await messageService.getAll(recipient_id, user_id);
        },
        createMessage: async (args, req) => {
            if (!req.isAuthenticated) {
                throw new Error('Unauthenticated');
            }

            const { content, recipient_id } = args.messageInput;
            return await messageService.create(content, req.user_id, recipient_id);
        },
        conversations: async (args, req) => {
            if (!req.isAuthenticated) {
                throw new Error('Unauthenticated');
            }

            const { user_id } = req;
            return await messageService.getConversations(user_id);
        }
    }
};