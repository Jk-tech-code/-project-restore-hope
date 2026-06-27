const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
    maxlength: [200, 'Organization name cannot exceed 200 characters'],
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person is required'],
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
    required: [true, 'Interest type is required'],
    enum: {
      values: ['church-partner', 'corporate-sponsor', 'foundation-grant', 'inkind-support', 'media-partner', 'other'],
      message: '{VALUE} is not a valid partnership type',
    },
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

module.exports = mongoose.model('Partner', partnerSchema);
