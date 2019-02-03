const graphqlHttp = require('express-graphql');

const schema = require('./schema');
const resolvers = require('./resolvers');

const ROUTE_PATH = '/api/graphql';

class GraphQLRoute {
    constructor(app) {
        app.use(`${ROUTE_PATH}`, graphqlHttp({
            schema: schema,
            rootValue: resolvers,
            graphiql: true
        }));
    }
}

module.exports = GraphQLRoute;