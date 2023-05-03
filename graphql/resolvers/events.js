const Event = require('../../models/events');
const User = require('../../models/user');
const { transformEvent } = require('./common');

module.exports = {
  events: async () => {
    try {
      const events = await Event.find()
      // .populate('creator') // auto-populate/pull data for relational fields (foreignKey)

      return events.map(event => (transformEvent(event)));
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
      const result = await newEvent.save()
      const createdEvent = transformEvent(result);
      
      const creator = await User.findById('644a872d54e2599279036d7a'); // TODO: replace hardcoded
      if (!creator) {
        throw new Error('User not found');
      }
      // Mongoose can accept either the objectId or actual object being referenced (~foreignKey)
      creator.createdEvents.push(newEvent);
      await creator.save();

      return createdEvent;
    } catch (err) {
      throw err;
    }
  }
};
