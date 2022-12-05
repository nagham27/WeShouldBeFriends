const { User, Message } = require("../../models");
const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/env.json");
const { Op } = require("sequelize");

module.exports = {
  Query: {
    getUsers: async (_, __, { user }) => {
      try {
        if (!user) {
          throw new AuthenticationError("Unauthenticated");
        }
        let users = await User.findAll({
          attributes: ["username", "imageUrl", "createdAt"],
          where: { username: { [Op.ne]: user.username } },
        });

        const allUserMessages = await Message.findAll({
          where: {
            [Op.or]: [{ from: user.username }, { to: user.username }],
          },
          order: [["createdAt", "DESC"]],
        });

        users = users.map((otherUser) => {
          const latestMessage = allUserMessages.find(
            (m) => m.from === otherUser.username || m.to === otherUser.username
          );
          otherUser.latestMessage = latestMessage;
          return otherUser;
        });

        return users;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    login: async (_, args) => {
      const { username, password } = args;
      let errors = {};
      try {
        if (username.trim() === "")
          errors.username = "username must not be empty";
        if (password === "") errors.password = "password must not be empty";
        const user = await User.findOne({ where: { username } });
        console.log(user);
        if (Object.keys(errors).length > 0) {
          throw new UserInputError("Bad input", { errors });
        }
        if (!user) {
          errors.username = "User not found";
          throw new UserInputError("user not found", { errors });
        }

        const correctPassword = await bcrypt.compare(password, user.password);
        if (!correctPassword) {
          errors.password = "password is incorrect";
          throw new AuthenticationError("password is incorrect", { errors });
        }

        const token = jwt.sign(
          {
            username,
          },
          JWT_SECRET,
          { expiresIn: 60 * 60 }
        );

        console.log(user);

        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token: token,
        };
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      let { username, email, password, confirmPassword } = args;
      let errors = {};
      try {
        // validate
        if (email.trim() === "") errors.email = "Email must not be empty";
        if (username.trim() === "")
          errors.username = "Username must not be empty";
        if (password === "") errors.password = "Password must not be empty";
        if (confirmPassword === "") {
          errors.confirmPasssword = "Repeat password must not be empty";
        }

        if (password !== confirmPassword) {
          errors.confirmPassword = "Passwords must match";
        }

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        // hash pass
        password = await bcrypt.hash(password, 7);
        // create
        const user = await User.create({
          username,
          email,
          password,
        });
        // return user
        return user;
      } catch (err) {
        console.log(err);
        if (err.name === "SequelizeUniqueConstraintError") {
          err.errors.forEach((e) => {
            errors[e.path] = `${e.path} is already taken`;
          });
        }
        if (err.name === "SequelizeValidationError") {
          err.errors.forEach((e) => {
            errors[e.path] = e.message;
          });
        }
        console.log(errors);
        throw new UserInputError("Bad input", { errors });
      }
    },
  },
};
