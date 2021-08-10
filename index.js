// importing absolute dependencies
const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

// importing relative dependencies
const { MONGODB_ATLAS_URI } = require("./config");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

// initialize a apollo server that takes typeDefs, resolvers and context as parameters
const server = new ApolloServer({
  // typeDefs tell the graphql about the data, data that we are about to perform CRUD operations on, we cannot just CRUD anything we want. In graphql every process should have a clear defined type
  typeDefs,
  // resolvers are functions that perform all operations on the defined typeDefs
  resolvers,
  // context provides the request object(req here) that we typically see in any node server (req,res)
  context: ({ req }) => ({ req }),
});

// connect to mongodb atlas cloud database
mongoose
  .connect(
    // MONGODB_ATLAS_URI is the connection string which we get from the mongodb atlas cloud platform
    MONGODB_ATLAS_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("MongoDB Atlas Connected");
    return server.listen({ port: 5000 });
  })
  .then((res) => console.log(`Server listening at ${res.url}`))
  .catch((error) => console.log(error));
