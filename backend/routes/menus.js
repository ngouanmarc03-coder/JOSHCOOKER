const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');
const { adminAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');

const menuUpload = upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

// Get all available menus
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { isAvailable: true };
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const menus = await Menu.find(filter).sort({ createdAt: -1 });
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const cats = await Menu.distinct('category');
    res.json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const menus = await Menu.find().sort({ createdAt: -1 });
    res.json(menus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: create menu
router.post('/', adminAuth, (req, res, next) => {
  req.uploadFolder = 'menus';
  next();
}, menuUpload, async (req, res) => {
  try {
    const { name, description, category, price, promoPrice, isPromo, isNew } = req.body;
    if (!name || !category || !price) return res.status(400).json({ message: 'Nom, categorie et prix requis.' });
    const data = {
      name, description, category,
      price: parseFloat(price),
      promoPrice: promoPrice ? parseFloat(promoPrice) : null,
      isPromo: isPromo === 'true',
      isNew: isNew === 'true'
    };
   if (req.files?.image1) data.image1 = req.files.image1[0].path;
if (req.files?.image2) data.image2 = req.files.image2[0].path;
if (req.files?.video) data.video = req.files.video[0].path;
    const menu = await Menu.create(data);
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: update menu
router.put('/:id', adminAuth, (req, res, next) => {
  req.uploadFolder = 'menus';
  next();
}, menuUpload, async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu introuvable.' });
    const fields = ['name', 'description', 'category', 'isAvailable'];
    fields.forEach(f => { if (req.body[f] !== undefined) menu[f] = req.body[f]; });
    if (req.body.price) menu.price = parseFloat(req.body.price);
    if (req.body.promoPrice) menu.promoPrice = parseFloat(req.body.promoPrice);
    if (req.body.isPromo !== undefined) menu.isPromo = req.body.isPromo === 'true';
    if (req.body.isNew !== undefined) menu.isNew = req.body.isNew === 'true';
    if (req.body.isAvailable !== undefined) menu.isAvailable = req.body.isAvailable === 'true';

    const replaceFile = (field, folder, subfolder) => {
      if (req.files?.[field]) {
        const old = path.join(__dirname, '..', menu[folder] || '');
        if (menu[folder] && fs.existsSync(old)) fs.unlinkSync(old);
        menu[folder] = req.files[field][0].path;
      }
    };
    replaceFile('image1', 'image1');
    replaceFile('image2', 'image2');
    replaceFile('video', 'video');
    await menu.save();
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: delete
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Menu introuvable.' });
    ['image1', 'image2', 'video'].forEach(f => {
      if (menu[f]) {
        const p = path.join(__dirname, '..', menu[f]);
        if (fs.existsSync(p)) fs.unlinkSync(p);
      }
    });
    await menu.deleteOne();
    res.json({ message: 'Menu supprime.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
