const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/events');
dotenv.config();
const app = express();
app.use(bodyParser.json());



let events = [];

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }


    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      // Note: return the promise so that graphQL will await automatically
      return Event.find()
        .then(events => {
          return events.map(event => ({...event._doc}));
        })
        .catch(err => {throw err});
    },
    createEvent: (args) => {
      const newEvent = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: args.eventInput.price,
        date: new Date(args.eventInput.date)
      })

      // Note: when we return a Promise, graphQL automatically awaits the result 
      return newEvent.save()
        .then( res => {
          console.log(res);
          /* Note: ._doc is a special mongoose feature wherein it only returns the core 
           *  attributes of object and removes other mongo meta-data */
          return {...res._doc};
        })
        .catch( err => {
          console.log(err);
          throw err;
        });
    }
  },
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
