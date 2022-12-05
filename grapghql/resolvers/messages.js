const { User, Message } = require("../../models");
const { UserInputError, AuthenticationError } = require("apollo-server");
const { Op } = require("sequelize");
module.exports = {
  Query: {
    getMessage: async (parent, { from }, { user }) => {
      try {
        if (!user) {
          throw new AuthenticationError("Unauthenticated");
        }

        // get other user
        const otherUser = await User.findOne({
          where: { username: from },
        });

        if (!otherUser) {
          throw new UserInputError("Other user not found");
        }
        const usernames = [user.username, otherUser.username];
        const messages = await Message.findAll({
          where: {
            from: { [Op.in]: usernames },
            to: { [Op.in]: usernames },
          },
          order: [["createdAt", "DESC"]],
        });
        return messages;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    sendMessage: async (parent, { to, content }, { user }) => {
      try {
        if (!user) {
          throw new AuthenticationError("Unauthenticated");
        }

        if (user.username === to) {
          throw new UserInputError("Can't send messages to yourself");
        }

        const recipient = await User.findOne({ where: { username: to } });
        if (!recipient) {
          throw new UserInputError("User not found");
        }

        if (content.trim() === "") {
          throw new UserInputError("Message content is empty");
        }

        const message = await Message.create({
          from: user.username,
          to,
          content,
        });
        return message;
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
  },
};
