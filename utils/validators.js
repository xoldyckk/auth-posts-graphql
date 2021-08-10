// validates whether the input provided by the client for the sign up operation is valid
module.exports.validateSignUpInput = (
  email,
  username,
  password,
  confirmPassword
) => {
  // errors object contains all the error messages and is sent back to the client to help it figure out where its providing the wrong input
  const errors = {};

  // trims all the white spaces from start and end of the email
  if (email.trim() === "") {
    // returns this error message if email is an empty string
    errors.email = "Email must not be empty";
  } else {
    // regular expression for validating email format
    const regEx =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email.match(regEx)) {
      // returns this error message if the provided email's format doesn't match a typical email format
      errors.email = "Email must be a valid email address";
    }
  }

  // checks whether username is an empty string
  if (username.trim() === "") {
    // returns this error message if the username is empty
    errors.username = "Username must not be empty";
  }

  if (password === "") {
    // returns this error message if password is an empty string
    errors.password = "Password must not be empty";
  } else if (password !== confirmPassword) {
    // returns this error message if password and confirm password do not match
    errors.confirmPassword = "Passwords must match";
  }

  // returns an object with the errors object that contains all the error messages and a valid boolean that tells whether the errors object has at least one or more error messages
  return { errors, valid: Object.keys(errors).length < 1 };
};

module.exports.validateSignInInput = (username, password) => {
  // errors object contains all the error messages and is sent back to the client to help it figure out where its providing the wrong input
  const errors = {};

  // checks whether username is an empty string
  if (username.trim() === "") {
    // returns this error message if the username is empty
    errors.username = "Username must not be empty";
  }

  if (password === "") {
    // returns this error message if password is an empty string
    errors.password = "Password must not be empty";
  }

  // returns an object with the errors object that contains all the error messages and a valid boolean that tells whether the errors object has at least one or more error messages
  return { errors, valid: Object.keys(errors).length < 1 };
};
