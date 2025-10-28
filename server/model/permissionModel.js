const mongoose = require('mongoose');

const confirmationRequestSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true, // one confirmation per booking
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: null, // null = not yet responded
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ConfirmationRequest', confirmationRequestSchema);