const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', adminAuth, (req, res, next) => {
  req.uploadFolder = 'events';
  next();
}, upload.single('media'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Fichier media requis.' });
    const { title, description, discount, startDate, endDate } = req.body;
    const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    const event = await Event.create({
      title, description, discount,
      mediaType,
     mediaUrl: req.file.path,
      startDate, endDate
    });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', adminAuth, (req, res, next) => {
  req.uploadFolder = 'events';
  next();
}, upload.single('media'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Evenement introuvable.' });
    const fields = ['title', 'description', 'discount', 'startDate', 'endDate'];
    fields.forEach(f => { if (req.body[f] !== undefined) event[f] = req.body[f]; });
    if (req.body.isActive !== undefined) event.isActive = req.body.isActive === 'true';
    if (req.file) {
      const old = path.join(__dirname, '..', event.mediaUrl);
      if (fs.existsSync(old)) fs.unlinkSync(old);
      event.mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
      event.mediaUrl = req.file.path;
    }
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Evenement introuvable.' });
    const p = path.join(__dirname, '..', event.mediaUrl);
    if (fs.existsSync(p)) fs.unlinkSync(p);
    await event.deleteOne();
    res.json({ message: 'Evenement supprime.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
