const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone)
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email deja utilise.' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, phone, role: 'client', isValidated: false });
    res.json({ message: 'Compte cree. En attente de validation par l\'admin.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    if (user.role !== 'admin' && !user.isValidated)
      return res.status(403).json({ message: 'Compte en attente de validation par l\'admin.' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, isSpecialClient: user.isSpecialClient, orderCount: user.orderCount }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify special code
router.post('/verify-special', async (req, res) => {
  try {
    const { userId, code } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });
    if (!user.isSpecialClient) return res.status(403).json({ message: 'Vous n\'etes pas encore client special.' });
    if (user.specialCode !== code) return res.status(400).json({ message: 'Code incorrect.' });
    res.json({ success: true, message: 'Code valide! Bienvenue dans l\'espace client special.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
