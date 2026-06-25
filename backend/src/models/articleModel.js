const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true // Indexed for performance
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    index: true // Indexed for filtering performance
  },
  tags: {
    type: [String],
    default: []
  },
  published: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Add index on createdAt for sorting performance
articleSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Article', articleSchema);
