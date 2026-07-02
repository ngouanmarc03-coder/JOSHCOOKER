const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Settings = require('../models/Settings');
const { auth, adminAuth } = require('../middleware/auth');

// Create order
router.post('/', async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, items, totalAmount, paymentMethod, paymentNumber, notes, userId } = req.body;
    if (!customerName || !customerPhone || !items?.length || !totalAmount || !paymentMethod)
      return res.status(400).json({ message: 'Informations de commande incompletes.' });
    const order = await Order.create({
      customerName, customerPhone, customerEmail, items, totalAmount, paymentMethod, paymentNumber, notes, userId: userId || null
    });
    // Update user order count if logged in
    if (userId) {
      const settings = await Settings.findOne();
      const threshold = settings?.specialClientThreshold || 10;
      const user = await User.findById(userId);
      if (user) {
        user.orderCount = (user.orderCount || 0) + 1;
        if (user.orderCount >= threshold && !user.isSpecialClient) {
          user.isSpecialClient = true;
        }
        await user.save();
      }
    }
    res.json({ message: 'Commande envoyee avec succes! L\'admin va valider apres depot.', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all orders
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// User: get own orders
router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: update order status
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Commande introuvable.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
