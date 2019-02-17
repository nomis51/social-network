const validateToken = require('../../middlewares/authentication').validateToken;

module.exports = (socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        const decodedToken = validateToken(socket.handshake.query.token);
        if (!decodedToken) {
            socket.isAuthenticated = false;
            return next(new Error('Authentication error'));
        }

        socket.isAuthenticated = true;
        socket.user_id = decodedToken.user_id;
        next();
    } else {
        socket.isAuthenticated = false;
        next(new Error('Authentication error'));
    }
}