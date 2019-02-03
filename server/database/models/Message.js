const validator = require('../schemaValidator');
const uniqid = require('uniqid');

const Message = {
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
        creator: {
            type: 'object',
            default: () => undefined
        }
    },
    validate: (message) => {
        return validator(message, Message.schema);
    },
    create: (content) => {
        const message = {
            content
        };

        let validatedMessage = Message.validate(message);

        return validatedMessage ? validatedMessage : null;
    }
};

module.exports = Message;