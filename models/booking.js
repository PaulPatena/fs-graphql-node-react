const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    } 
  },
  { timestamps: true} // This flag to mongoose gives us createdAt and updatedAt fields
 );

module.exports = mongoose.model('Booking', bookingSchema);
