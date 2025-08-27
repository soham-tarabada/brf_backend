import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
    featuredImages: {
      type: [String],
      required: true,
      validate: v => Array.isArray(v) && v.length > 0
    },
  shortDescription: {
    type: String,
    required: true,
    maxLength: 200
  },
  fullDescription: {
    type: String,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Event', eventSchema);