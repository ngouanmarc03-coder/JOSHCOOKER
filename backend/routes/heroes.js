const express = require('express');
const router = express.Router();
const Hero = require('../models/Hero');
const { adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

// Get all active heroes
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { isActive: true };
    if (type) filter.type = type;
    const heroes = await Hero.find(filter).sort({ order: 1 });
    res.json(heroes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all heroes
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const heroes = await Hero.find().sort({ order: 1 });
    res.json(heroes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: create hero
router.post('/', adminAuth, (req, res, next) => {
  req.uploadFolder = 'heroes';
  next();
}, upload.single('media'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Fichier media requis.' });
    const { type, title, subtitle, buttonText, buttonLink, order } = req.body;
    const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    const mediaUrl = req.file.path;
    const hero = await Hero.create({ type, mediaType, mediaUrl, title, subtitle, buttonText, buttonLink, order });
    res.json(hero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: update hero
router.put('/:id', adminAuth, (req, res, next) => {
  req.uploadFolder = 'heroes';
  next();
}, upload.single('media'), async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) return res.status(404).json({ message: 'Hero introuvable.' });
    const { type, title, subtitle, buttonText, buttonLink, order, isActive } = req.body;
    if (type) hero.type = type;
    if (title !== undefined) hero.title = title;
    if (subtitle !== undefined) hero.subtitle = subtitle;
    if (buttonText !== undefined) hero.buttonText = buttonText;
    if (buttonLink !== undefined) hero.buttonLink = buttonLink;
    if (order !== undefined) hero.order = order;
    if (isActive !== undefined) hero.isActive = isActive === 'true';
    if (req.file) {
      const old = path.join(__dirname, '..', hero.mediaUrl);
      if (fs.existsSync(old)) fs.unlinkSync(old);
      hero.mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
     hero.mediaUrl = req.file.path;
    }
    await hero.save();
    res.json(hero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: delete hero
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const hero = await Hero.findById(req.params.id);
    if (!hero) return res.status(404).json({ message: 'Hero introuvable.' });
    const filePath = path.join(__dirname, '..', hero.mediaUrl);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await hero.deleteOne();
    res.json({ message: 'Hero supprime.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
