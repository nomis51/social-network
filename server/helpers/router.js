const GraphQLRoute = require('../routes/graphql/graphql');
const AuthenticationMiddleware = require('../middlewares/authentication').middleware;
const CorsMiddleware = require('../middlewares/cors');
const SocketIORoute = require('../routes/socket.io/socket.io')

module.exports = (app, server) => {
    app.use(CorsMiddleware);
    app.use(AuthenticationMiddleware);

    new GraphQLRoute(app);
    new SocketIORoute(server);
}