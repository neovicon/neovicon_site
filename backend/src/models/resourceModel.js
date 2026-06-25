const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['affiliate', 'tool', 'book'],
    required: true,
    index: true // Indexed for filtering
  },
  isAffiliate: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

resourceSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Resource', resourceSchema);
