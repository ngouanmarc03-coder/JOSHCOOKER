const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  promoPrice: { type: Number, default: null },
  isPromo: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  image1: { type: String },
  image2: { type: String },
  video: { type: String },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Menu', menuSchema);
