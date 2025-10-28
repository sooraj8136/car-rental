const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: true,
  },
  pickupDate: {
    type: Date,
    required: true,
  },
  dropoffDate: {
    type: Date,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'completed', 'declined', 'confirmed'],
    default: 'pending',
  },
  ownerConfirmation: {
    type: String,
    enum: ['pending', 'confirmed', 'declined'],
    default: 'pending',
  },
  paymentId: {
    type: String,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);

