const usersResolvers = require("./users");
const postsResolvers = require("./posts");
const commentsResolvers = require("./comments");

// this file combines all the resolvers returned from different files into one thus reducing complexity
module.exports = {
  // Post here is like a middleware that checks if the current operation involves use of Post type in anyway. If it is, then this middleware adds the data likeCount and commentCount the the object and passes it on
  Post: {
    likeCount: (parent, args, context, info) => parent.likes.length,
    commentCount: (parent, args, context, info) => parent.comments.length,
  },
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
};
