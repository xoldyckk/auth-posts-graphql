const { model, Schema } = require("mongoose");

// mongoose schema to define a structure for Post model
const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: String,
  comments: [{ body: String, username: String, createdAt: String }],
  likes: [{ username: String, createdAt: String }],
  user: { type: Schema.Types.ObjectId, ref: "users" },
});

module.exports = model("post", postSchema);
