const GraphQLRoute = require('../routes/graphql/graphql');
const AuthenticationMiddleware = require('../middlewares/authentication');
const CorsMiddleware = require('../middlewares/cors');

module.exports = (app) => {
    app.use(CorsMiddleware);
    app.use(AuthenticationMiddleware);

    new GraphQLRoute(app);
}