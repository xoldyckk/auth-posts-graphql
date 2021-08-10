# auth-posts-graphql
Testing out graphQL using apollo server. Implemented user authentication using jsonwebtoken and CRUD operations on posts. Used mongodb atlas as the cloud database.

Add your mongodb atlas uri in config.js on the variable MONGODB_ATLAS_URI and a secret on the variable SECRET_KEY. Run command "yarn dev" while being in the root directory.
Then go to localhost:5000/graphql. There you can play with the different queries and mutations I have provided and even add your own queries and mutations if you'd like to.
