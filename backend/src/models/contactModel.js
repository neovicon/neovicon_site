const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  message: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    select: false // Do not return by default
  }
}, { timestamps: true });

contactSchema.index({ createdAt: -1 });

module.exports = mongoose.model('ContactMessage', contactSchema);
