const Post = require("../../models/Post");
const checkAuth = require("../../utils/checkAuth");
const { UserInputError, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");

module.exports = {
  Mutation: {
    createComment: async (parent, { postId, body }, context, info) => {
      // checks if the user making a post is authorized i.e., is logged in
      const { username } = checkAuth(context);

      const isValidObjectId = mongoose.isValidObjectId(postId);

      // checks if the postId is a valid mongoDB object id
      if (!isValidObjectId) {
        throw new Error("This post id is not valid");
      }

      // checks if the comment is an empty string
      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: { body: "Comment body must not be empty" },
        });
      }

      // finds the post on which the comment is to be made
      const post = await Post.findById(postId);

      if (post) {
        // adds the comment to the start of the comments array in post
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
        });

        await post.save();

        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },

    deleteComment: async (parent, { postId, commentId }, context, info) => {
      // checks if the user making a post is authorized i.e., is logged in
      const { username } = checkAuth(context);

      const isValidObjectId = mongoose.isValidObjectId(postId);

      // checks if the postId is a valid mongoDB object id
      if (!isValidObjectId) {
        throw new Error("This post id is not valid");
      }

      // finds the post on which the comment is to be made
      const post = await Post.findById(postId);

      if (post) {
        // finds the index of comment to be deleted
        const commentIndex = post.comments.findIndex(
          (comment) => comment.id === commentId
        );

        // checks if the username and the user who created the comment match
        if (post.comments[commentIndex].username === username) {
          // removes the comment from comments array
          post.comments.splice(commentIndex, 1);

          await post.save();
          return post;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Post not found");
      }
    },
  },
};
