const userResolvers = require("./users");
const messageResolvers = require("./messages");

module.exports = {
  Message: {
    createdAt: (parent) => {
      return parent.createdAt.toISOString();
    },
  },
  // User: {
  //   createdAt: (parent) => {
  //     console.log("LOOK HERE", parent.createdAt);
  //     // console.log("LOOK HERE", parent.createdAt.toISOString());
  //     return parent.createdAt;
  //   },
  // },
  Query: {
    ...userResolvers.Query,
    ...messageResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...messageResolvers.Mutation,
  },
};
