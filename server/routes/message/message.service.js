// const Message = require('../../database/models/Message');
const Message = require('../../database/models/Message');
const db = require('../../database/db');

const service = {
    getAll: () => {
        return new Promise(resolve => {
            const session = db.getSession();
            let messages = [];
            return session.run(`MATCH (user:User), (message:Message) WHERE (user)-[:WROTE]->(message) RETURN user,message`)
                .subscribe({
                    onNext: (record) => {
                        let message = db.parse(record, 'message', ['isDeleted']);
                        message.creator = db.parse(record, 'user', ['isDeleted', 'password']);
                        messages.push(message);
                    },
                    onCompleted: () => {
                        session.close();
                        resolve(messages);
                    },
                    onError: (err) => {
                        console.log(err);
                        throw err;
                    }
                });
        });
    },

    get: (query) => {
        return new Promise(resolve => {
            const session = db.getSession();
            let messages = [];
            let whereQuery = db.jsonToWhereQuery(query, 'message', { creator: 'user._id = @VALUE' });
            return session.run(`MATCH (user:User), (message:Message) WHERE ${whereQuery}${whereQuery == '' ? '' : ' AND '}(user)-[:WROTE]->(message) RETURN user,message`)
                .subscribe({
                    onNext: (record) => {
                        let message = db.parse(record, 'message', ['isDeleted']);
                        message.creator = db.parse(record, 'user', ['isDeleted', 'password']);
                        messages.push(message);
                    },
                    onCompleted: () => {
                        session.close();
                        resolve(messages);
                    },
                    onError: (err) => {
                        console.log(err);
                        throw err;
                    }
                });
        });
    },

    getOne: (query) => {
        return new Promise(resolve => {
            const session = db.getSession();
            let message;
            let whereQuery = db.jsonToWhereQuery(query, 'message', { creator: 'user._id = @VALUE' });
            return session.run(`MATCH (user:User), (message:Message) WHERE ${whereQuery}${whereQuery == '' ? '' : ' AND '}(user)-[:WROTE]->(message) RETURN user,message`)
                .subscribe({
                    onNext: (record) => {
                        session.close();
                        message = db.parse(record, 'message', ['isDeleted']);
                        message.creator = db.parse(record, 'user', ['isDeleted', 'password']);
                    },
                    onCompleted: () => {
                        resolve(message);
                    },
                    onError: (err) => {
                        console.log(err);
                        throw err;
                    }
                });
        });
    },

    create: (content, creator_id, recipient_id) => {
        return new Promise((resolve, reject) => {
            const message = Message.create(content);

            if (!message) {
                return reject('Invalid inputs');
            }

            let createdMessage;
            const session = db.getSession();
            return session.run(`MATCH (user:User), (recipient: User {_id:"${recipient_id}"}) WHERE user._id = "${creator_id}" CREATE (message:Message {
                _id: "${message._id}",
                content: "${message.content}",
                isDeleted: ${message.isDeleted},
                creationTime: "${message.creationTime}"
            }), (user)-[:WROTE]->(message)-[:DESTINATED_TO]->(recipient) RETURN message, user`)
                .subscribe({
                    onNext: (record) => {
                        session.close();
                        createdMessage = db.parse(record, 'message', ['isDeleted']);
                        createdMessage.creator = db.parse(record, 'user', ['isDeleted', 'password']);
                    },
                    onCompleted: () => {
                        resolve(createdMessage);
                    },
                    onError: (err) => {
                        console.log(err);
                        throw err;
                    }
                });
        });
    }
};

module.exports = service;