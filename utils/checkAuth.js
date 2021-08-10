const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { AuthenticationError } = require("apollo-server");

module.exports = (context) => {
  // store the authorization(jwt) token from the request(req) object sent from the client
  const authHeader = context.req.headers.authorization;

  // checks if the authorization token exists in the req object
  if (authHeader) {
    // splits the authorization token in two array items :["","token"] and takes the second item of the array i.e., the jwt token
    const token = authHeader.split("Bearer ")[1];

    // checks if the token exists
    if (token) {
      try {
        // verify the token with the SECRET_KEY which is only available on the server thus ensuring safety
        const user = jwt.verify(token, SECRET_KEY);
        // returns the user details extracted from the token
        return user;
      } catch (error) {
        throw new AuthenticationError("Invalid/Expired token");
      }
    }
    throw new Error("Authentication token must be of format: 'Bearer [token]");
  }

  throw new Error("Authorization header must be provided");
};
