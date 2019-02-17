const express = require('express');
const http = require('http');
const app = express();

const dbConfig = require('./database/config');

const router = require('./helpers/router');

const PORT = process.env.PORT || 8081;
const HOST = process.env.IP || 'localhost';

app.use(express.json());

const db = require('./database/db');
const neoConfig = require('./database/config');
db.connect(neoConfig.dev.url, neoConfig.dev.username, neoConfig.dev.password);

const server = http.createServer(app);
const io = require('socket.io')(server);
const socketioAuth = require('./routes/socket.io/socket.io.auth');

const messageService = require('./routes/message/message.service');
let clients = [];
io.use(socketioAuth)
    .on('connection', (client) => {
        console.log('Client connected');
        clients.push(client);

        client.on('disconnect', () => {
            console.log('Client disconnected');
            clients.slice(clients.indexOf(client), 1);
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

router(app);

server.listen(PORT, HOST, (err) => {
    if (err) {
        console.err(err);
    }

    console.log(`Server running on ${HOST}:${PORT}...`);
});