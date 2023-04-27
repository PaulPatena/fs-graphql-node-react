const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Event = require('./models/events');
const User = require('./models/user.js');
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

    type User {
      _id: ID!
      email: String!
      password: String
      createdEvents: [ ID! ]!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
      user(userId: String): User
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
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
    user: (args) => {
      return User.findById(args.userId)
        .then(user => {
          if (!user) {
            throw new Error(`User ${args.userId} does not exist`);
          }
          console.log(user);
          return {...user._doc}
        })
        .catch(err => {throw err;})
    },
    createEvent: (args) => {
      const newEvent = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: '644a872d54e2599279036d7a' // TODO: hard code user for now until auth is implemented
      })

      let savedEvent;
      // Note: when we return a Promise, graphQL automatically awaits the result 
      return newEvent
        .save()
        .then( res => {
          console.log(res);
          /* Note: ._doc is a special mongoose feature wherein it only returns the core 
           *  attributes of object and removes other mongo meta-data */
          savedEvent =  {...res._doc};
          return User.findById('644a872d54e2599279036d7a'); // TODO: replace hardcoded
        })
        .then( user => {
          if (!user) {
            throw new Error('User not found');
          }
          // Mongoose can accept either the objectId or actual object being referenced (~foreignKey)
          user.createdEvents.push(newEvent);
          return user.save();
        })
        .then( result =>{
          return savedEvent;
        })
        .catch( err => {
          console.log(err);
          throw err;
        });
    },
    createUser: (args) => {
      // Note: always return a PROMISE in your mutation
      return User.findOne({email: args.userInput.email})
      .then(user => {
        // Note: mongoose will always take u to then block whether you found a user or not
        //  (catch is only for db-connection errors). user will be undefined if not found
        if (user) {
           throw new Error(`User ${args.userInput.email} already exists`);
        }
        return bcrypt.hash(args.userInput.password, 12)
      })
      .then(hashedPassword => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword,
        });
        return user.save();
      })
      .then(result => {
        return {...result._doc, password: null}
      })
      .catch(err => {throw err;})
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
