const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  amount: {
    type: Number,
    required: [true, 'Donation amount is required'],
    min: [1, 'Donation must be at least $1'],
  },
  currency: {
    type: String,
    default: 'usd',
    enum: ['usd', 'eur', 'gbp'],
  },
  frequency: {
    type: String,
    enum: ['one-time', 'monthly'],
    default: 'one-time',
  },
  note: {
    type: String,
    maxlength: [1000, 'Note cannot exceed 1000 characters'],
  },
  stripePaymentIntentId: {
    type: String,
    required: true,
  },
  stripeCustomerId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed', 'refunded'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Donation', donationSchema);
