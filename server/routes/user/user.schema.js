const userService = require('../user/user.service');

module.exports = {
    types: `
        type User {
            _id: ID!
            firstName: String!
            lastName: String!
            email: String!
            password: String
            creationTime: String!
            isDeleted: Boolean
        }

        type AuthData {
            user_id: ID!
            token: String!
            tokenExpiration: Int!
        }
    `,
    inputs: `
        input UserInput {
            firstName: String!
            lastName: String!
            email: String!
            password: String!
        }
    `,
    queries: `
        users: [User!]!
        user(email: String!): User
        login(email: String!, password: String!): AuthData!
    `,
    mutations: `
        createUser(userInput: UserInput!): User
        removeUser(_id: String!): String
    `,
    resolvers: {
        users: async (args, req) => {
            if (!req.isAuthenticated) {
                throw new Error('Unauthenticated');
            }

            return await userService.getAll();
        },
        user: async (args, req) => {
            if (!req.isAuthenticated) {
                throw new Error('Unauthenticated');
            }

            return await userService.getOne(email);
        },
        createUser: async (args) => {
            const { firstName, lastName, email, password } = args.userInput;
            return await userService.create(email, firstName, lastName, password);
        },
        updateUser: async (args, req) => {
            if (!req.isAuthenticated) {
                throw new Error('Unauthenticated');
            }

            const { _id, updates } = args.userInput;
            return await userService.update(_id, updates);
        },
        removeUser: async (args, req) => {
            if (!req.isAuthenticated) {
                throw new Error('Unauthenticated');
            }

            const { _id } = args;
            return await userService.remove(_id);
        },
        login: async (args) => {
            const { email, password } = args;
            return await userService.login(email, password);
        }
    }
};