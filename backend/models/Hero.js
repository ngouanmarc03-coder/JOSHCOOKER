const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  type: { type: String, enum: ['main', 'event', 'special'], default: 'main' },
  mediaType: { type: String, enum: ['image', 'video'], required: true },
  mediaUrl: { type: String, required: true },
  title: { type: String },
  subtitle: { type: String },
  buttonText: { type: String },
  buttonLink: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hero', heroSchema);
