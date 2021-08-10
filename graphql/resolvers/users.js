const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../../config");
const { UserInputError } = require("apollo-server");
const {
  validateSignUpInput,
  validateSignInInput,
} = require("../../utils/validators");

// generate jwt authorization token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
};

module.exports = {
  Mutation: {
    async signUp(
      // parent contains data of the parent component in which this type is called(if it is called in another type)
      parent,
      // these are the type parameters passed from the client. Generally denoted by args but here we are using destructuring
      { signUpInput: { email, username, password, confirmPassword } },
      // context contains the request(req) object from the client
      context,
      // info gives information the current process
      info
    ) {
      const { valid, errors } = validateSignUpInput(
        email,
        username,
        password,
        confirmPassword
      );

      // if valid is true i.e., there are error messages in errors object we throw a UserInputError and return the error messages to the client
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // checks if a user with given email already exists
      const existingUser = await User.findOne({ username });

      // if a user exists with the given email error message is sent
      if (existingUser) {
        throw new UserInputError("Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }

      // hash the password to make sure no one can know it not even the server/admin himself
      const hashedPassword = await bcrypt.hash(password, 12);

      // create new mongoose User model and provide the current time to the createdAt field
      const newUser = new User({
        email,
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
      });

      // save the created User model to the database
      const user = await newUser.save();

      // generates jwt authorization token which is stored on client's browser
      const token = generateToken(user);

      // returns an object with jwt token and user information
      return { ...user._doc, id: user._id, token };
    },

    async signIn(
      parent,
      { signInInput: { username, password } },
      context,
      info
    ) {
      const { errors, valid } = validateSignInInput(username, password);

      // if valid is true i.e., there are error messages in errors object we throw a UserInputError and return the error messages to the client
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // checks if a user with given email already exists
      const existingUser = await User.findOne({ username });

      // if the user does not exists send error message to the client
      if (!existingUser) {
        errors.general = "User not found";
        throw new UserInputError("User not found", { errors });
      }

      // checks if the password and password in database match
      const isCorrectPassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      // sends error message if the passwords do not match
      if (!isCorrectPassword) {
        errors.general = "Wrong credenatials";
        throw new UserInputError("Wrong credenatials", { errors });
      }

      // generates jwt authorization token which is stored on client's browser
      const token = generateToken(existingUser);

      // returns an object with jwt token and user information
      return { ...existingUser._doc, id: existingUser._id, token };
    },
  },
};
