const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const authMw = require('./middleware/auth-mw');

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next(); // continue API processing to gQL
});

app.use(authMw); // Use authentication mw prior to API handling

app.use('/graphql', graphqlHTTP({
  schema: graphQlSchema,
  rootValue: graphQlResolvers,
  graphiql: process.env.GRAPHIQL_ENABLED === 'true' ? true : false
}));

app.get('/', (req, res, next) => {
  res.send('Hello World');
});

mongoose.connect(process.env.MONGO_SERVER)
  .then(()=>{
    app.listen(process.env.PORT);
  })
  .catch( err => {
    console.log(err);
  });
