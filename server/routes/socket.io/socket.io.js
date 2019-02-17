const SocketIO = require('socket.io');
const socketioAuth = require('./socket.io.auth');

module.exports = class SocketIORoute {
    constructor(server) {
        const io = SocketIO(server);

        let clients = [];
        io.use(socketioAuth)
            .on('connection', (client) => {
                console.log(client);
                clients.push(client);

                client.on('disconnect', () => {
                    clients.slice(clients.indexOf(client), 1);
                    console.log(clients);
                });

                //** Message **//
                client.on('sendMessage', (message) => {
                    console.log(message);
                });
            });
    }
}