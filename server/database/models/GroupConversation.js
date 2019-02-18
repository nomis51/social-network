const validator = require('../schemaValidator');
const uniqid = require('uniqid');

const GroupConversation = {
    schema: {
        _id: {
            type: 'string',
            default: () => uniqid()
        },
        name: {
            type: 'string',
            required: true,
            validation: (value) => {
                return value.length >= 1 && value.length <= 50;
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
        creator: {
            type: 'object',
            default: () => undefined
        }
    },
    validate: (groupConversation) => {
        return validator(groupConversation, GroupConversation.schema);
    },
    create: (content) => {
        const groupConversation = {
            content
        };

        let validatedGroupConversation = GroupConversation.validate(groupConversation);

        return validatedGroupConversation ? validatedGroupConversation : null;
    }
};

module.exports = GroupConversation;