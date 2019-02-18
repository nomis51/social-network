const SocketIO = require('socket.io');
const socketioAuth = require('./socket.io.auth');
const messageService = require('../message/message.service');

module.exports = class SocketIORoute {
    constructor(server) {
        this.io = SocketIO(server);

        this.clients = new Map();
        this.io.use(socketioAuth)
            .on('connection', (client) => {
                console.log('Client connected');
                this.clients.set(client.user_id, client);

                client.on('disconnect', () => {
                    console.log('Client disconnected');
                    this.clients.delete(client.user_id);
                });

                //** Message **//
                client.on('sendMessage', (message) => {
                    const { content, recipient_id } = message;
                    messageService.create(content, client.user_id, recipient_id)
                        .then(createdMessage => {
                            client.emit('sendMessage', createdMessage);
                            const recipient = this.clients.get(recipient_id);

                            if (recipient) {
                                recipient.emit('newMessage', createdMessage);
                            }
                        });
                });

                client.on('typing', (recipient_id) => {
                    const recipient = this.clients.get(recipient_id);

                    if (recipient) {
                        recipient.emit('recipientTyping');
                    }
                });
            });
    }
}