const Post = require("../../models/Post");
const mongoose = require("mongoose");
const checkAuth = require("../../utils/checkAuth");
const { AuthenticationError, UserInputError } = require("apollo-server");

module.exports = {
  Query: {
    async getPosts() {
      try {
        // gets all the posts in database sorted by the latest to the oldest posts
        const posts = await Post.find().sort({ createdAt: -1 });
        // returns the fetched posts
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },

    async getPost(parents, { postId }, context, info) {
      try {
        // checks if the postId is a valid mongoDB object id
        const isValidObjectId = mongoose.isValidObjectId(postId);

        if (!isValidObjectId) {
          throw new Error("This post id is not valid");
        }

        // gets the post with id = postId
        const post = await Post.findById(postId);

        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    async createPost(parent, { body }, context, info) {
      // checks if the user making a post is authorized i.e., is logged in
      const user = checkAuth(context);

      // checks if the post is an empty string
      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      // saves the post to database
      const post = await newPost.save();

      return post;
    },

    async deletePost(parent, { postId }, context, info) {
      // checks if the user making a post is authorized i.e., is logged in
      const user = checkAuth(context);

      const isValidObjectId = mongoose.isValidObjectId(postId);

      // checks if the postId is a valid mongoDB object id
      if (!isValidObjectId) {
        throw new Error("This post id is not valid");
      }

      try {
        const post = await Post.findById(postId);

        // checks if the user making the request and the user who made the post are the same person
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (error) {
        throw new Error(error);
      }
    },

    async likePost(parent, { postId }, context, info) {
      // checks if the user making a post is authorized i.e., is logged in
      const { username } = checkAuth(context);

      const isValidObjectId = mongoose.isValidObjectId(postId);

      // checks if the postId is a valid mongoDB object id
      if (!isValidObjectId) {
        throw new Error("This post id is not valid");
      }

      const post = await Post.findById(postId);

      // checks if the user making the request exists in the likes array. If he/she does exist in the likes array remove them from the array
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          post.likes = post.likes.filter((like) => like.username !== username);
        }
        // adds the user to the likes array of the post
        else {
          post.likes.push({ username, createdAt: new Date().toISOString() });
        }

        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },
  },
};
