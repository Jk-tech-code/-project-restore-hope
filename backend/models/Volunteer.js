const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
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
  phone: {
    type: String,
    trim: true,
  },
  interest: {
    type: String,
    required: [true, 'Interest area is required'],
    enum: {
      values: ['mission-trip', 'skills-based', 'prayer-advocacy', 'fundraising', 'other'],
      message: '{VALUE} is not a valid interest area',
    },
  },
  availability: {
    type: String,
    trim: true,
    maxlength: [200, 'Availability cannot exceed 200 characters'],
  },
  message: {
    type: String,
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
