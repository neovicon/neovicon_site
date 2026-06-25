const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  }
});

const tutorialSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
    index: true // Indexed for filtering
  },
  sections: [sectionSchema],
  published: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

tutorialSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Tutorial', tutorialSchema);
