const User = require('../../models/user');
const Event = require('../../models/events');

const dateToString = date => new Date(date).toISOString();

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

const transformBooking = booking => {
  return {
    ...booking._doc,
    user: getUserById.bind(this, booking._doc.user),
    event: getEventById.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt)
  };
};

const transformEvent = event => {
  /* Note: ._doc is a special mongoose feature wherein it only returns the core 
   *  attributes of object and removes other mongo meta-data */
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: getUserById.bind(this, event.creator)
  };
};

exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
exports.getUserById = getUserById;