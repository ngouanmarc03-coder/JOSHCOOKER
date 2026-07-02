const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

// Admin: get all users
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'client' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: validate user
router.put('/:id/validate', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isValidated: true }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: send special code
router.post('/:id/special-code', adminAuth, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Code requis.' });
    const user = await User.findByIdAndUpdate(req.params.id, { specialCode: code, isSpecialClient: true }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });
    res.json({ message: 'Code special envoye avec succes.', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: delete user
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilisateur supprime.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Me
router.get('/me', auth, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
