const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.json");

module.exports = (context) => {
  if (context.req && context.req.headers.authorization) {
    const token = context.req.headers.authorization.split(" ")[1];
    // console.log(token);
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      context.user = decodedToken;
      //   console.log("this is user decoded", decodedToken);
    });
  }
  return context;
};
