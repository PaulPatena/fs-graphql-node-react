const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

dotenv.config();
const app = express();
app.use(bodyParser.json());

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
