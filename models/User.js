const { model, Schema } = require("mongoose");

// mongoose schema to define a structure for User model
const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
});

module.exports = model("user", userSchema);
