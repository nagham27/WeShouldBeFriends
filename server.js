const { ApolloServer } = require("apollo-server");

const { sequelize } = require("./models");

// The GraphQL schema
const typeDefs = require("./grapghql/typeDefs");

// A map of functions which return data for the schema.
const resolvers = require("./grapghql/resolvers/index");
const contextMiddleware = require("./util/contextMiddleware");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);

  sequelize
    .authenticate()
    .then(() => console.log("Database connection established"))
    .catch((err) => console.log(err));
});
