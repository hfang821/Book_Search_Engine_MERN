const express = require('express');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
//import ApolloServer
const {ApolloServer} = require('apollo-server-express');

//import typeDefs and resolvers
const {typeDefs, resolvers} = require('./schemas');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

//create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs, 
  resolvers,
  context: authMiddleware
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//create a new instance of an Apollo server with the GraphQL schemas
const startApolloServer = async (typeDefs, resolvers)  => {
  await server.start();
  //integrate our apollo server with the express application as middleware
  server.applyMiddleware({app});

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
})

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    //log where we can go to test our GQL API
    console.log(`Use GQL at https://localhost:${PORT}${server.graphqlPath}`);
  });
});
}

startApolloServer(typeDefs,resolvers);