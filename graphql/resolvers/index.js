const bcrypt = require('bcryptjs');
const Event = require('../../models/events');
const User = require('../../models/user.js');
const Booking = require('../../models/booking.js');

const getUserById = async userId => {
  try {  
    const user = await User.findById(userId)

    if (!user) {
      throw new Error('User not found');
    }

    return {
      ...user._doc,
      password: null,
      createdEvents: getEvents.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
}

const getEvents = async eventIds => {
  try {
    console.log(eventIds);
    const events = await Event.find({_id: {$in: eventIds}})

    return events.map(event => ({
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: getUserById.bind(this, event._doc.creator)
      }));
  } catch (err) {
    throw err;
  }
} 

const getEventById = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      date: new Date(event.date).toISOString(),
      creator: getUserById.bind(this, event.creator)
    };
  } catch (err) {
    throw err;
  }
}

module.exports = {
  events: async () => {
    try {
      const events = await Event.find()
      // .populate('creator') // auto-populate/pull data for relational fields (foreignKey)

      return events.map(event => ({
        ...event._doc,
        date: new Date(event._doc.date).toISOString(),
        creator: getUserById.bind(this, event._doc.creator)
      }));
    } catch (err) {
      throw err;
    }
  },
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => ({
        ...booking._doc,
        user: getUserById.bind(this, booking._doc.user),
        event: getEventById.bind(this, booking._doc.event),
        createdAt: new Date(booking._doc.createdAt).toISOString(),
        updatedAt: new Date(booking._doc.updatedAt).toISOString(),
       }));
    } catch (err) {
      throw err;
    }
  },
  user: async args => {
    try {
      const user = await getUserById(args.userId);
      return user;
    } catch (err) {
      throw err;
    }
  },
  createEvent: async args => {
    try {
      const newEvent = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: '644a872d54e2599279036d7a' // TODO: hard code user for now until auth is implemented
      })

      // Note: when we return a Promise, graphQL automatically awaits the result 
      const result = await newEvent.save()

      console.log(result);
      /* Note: ._doc is a special mongoose feature wherein it only returns the core 
      *  attributes of object and removes other mongo meta-data */
      const savedEvent =  {
        ...result._doc, 
        creator: getUserById.bind(this, result._doc.creator),
        date: new Date(result._doc.date).toISOString(),
      };
      
      const user = await User.findById('644a872d54e2599279036d7a'); // TODO: replace hardcoded
      if (!user) {
        throw new Error('User not found');
      }
      // Mongoose can accept either the objectId or actual object being referenced (~foreignKey)
      user.createdEvents.push(newEvent);
      await user.save();

      return savedEvent;
    } catch (err) {
      throw err;
    }
  },
  createUser: async args => {
    try {
      // Note: always return a PROMISE in your mutation
      const user = await User.findOne({email: args.userInput.email})

      // Note: mongoose will always take u to then block whether you found a user or not
      //  (catch is only for db-connection errors). user will be undefined if not found
      if (user) {
          throw new Error(`User ${args.userInput.email} already exists`);
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const newUser = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });
      const result = await newUser.save();
      console.log(result);

      return {...result._doc, password: null};
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async args => {
    try {
      const fetchedEvent = await Event.findOne({_id: args.eventId});

      const booking = new Booking({
        user: "644a872d54e2599279036d7a",
        event: fetchedEvent
      })

      const result = await booking.save();
      return {
        ...result._doc,
        user: getUserById.bind(this, booking._doc.user),
        event: getEventById.bind(this, booking._doc.event)
      }

    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = {
        ...booking.event._doc,
        creator: getUserById.bind(this, booking.event.creator)
      };
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};
