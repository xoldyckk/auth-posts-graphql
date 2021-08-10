const { gql } = require("apollo-server");

module.exports = gql`
  # ! after a keyword means that it cannot be null. If a null value is returned graphql throws an error
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }

  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }

  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }

  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }

  # input types tell what kind of data is to be expected from the client
  input SignUpInput {
    email: String!
    username: String!
    password: String!
    confirmPassword: String!
  }

  input SignInInput {
    username: String!
    password: String!
  }

  # A Query is used for getting data i.e., read in terms of CRUD operations
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
  }

  # A Mutation is used for mutating/changing data i.e., create/update/delete in terms of CRUD operations
  type Mutation {
    signUp(signUpInput: SignUpInput): User!
    signIn(signInInput: SignInInput): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    likePost(postId: ID!): Post!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
  }
`;
