const SocketIO = require('socket.io');
const socketioAuth = require('./socket.io.auth');
const messageService = require('../message/message.service');

module.exports = class SocketIORoute {
    constructor(server) {
        this.io = SocketIO(server);

        this.clients = [];
        this.io.use(socketioAuth)
            .on('connection', (client) => {
                console.log('Client connected');
                this.clients.push(client);

                client.on('disconnect', () => {
                    console.log('Client disconnected');
                    this.clients.slice(this.clients.indexOf(client), 1);
                });

                //** Message **//
                client.on('sendMessage', (message) => {
                    const { content, recipient_id } = message;
                    messageService.create(content, client.user_id, recipient_id)
                        .then(createdMessage => {
                            client.emit('sendMessage', createdMessage);
                        });
                });
            });
    }
}