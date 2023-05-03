
const Event = require('../../models/events');
const Booking = require('../../models/booking');
const { transformEvent, transformBooking } = require('./common');

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => (transformBooking(booking)));
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async args => {
    try {
      const fetchedEvent = await Event.findOne({_id: args.eventId});
      const booking = new Booking({
        user: "644a872d54e2599279036d7a", //TODO: replace
        event: fetchedEvent
      });

      const result = await booking.save();
      return transformBooking(result);
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};
