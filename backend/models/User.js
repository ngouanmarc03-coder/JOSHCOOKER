const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
  isValidated: { type: Boolean, default: false },
  orderCount: { type: Number, default: 0 },
  isSpecialClient: { type: Boolean, default: false },
  specialCode: { type: String, default: null },
  specialCodeUsed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
