const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const upload = require('../middleware/upload');
const { adminAuth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/', adminAuth, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    Object.assign(settings, req.body);
    settings.updatedAt = new Date();
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function settingsUpload(req, res, next) {
  req.uploadFolder = 'settings';
  upload.fields([
    { name: 'siteLogo', maxCount: 1 },
    { name: 'waveLogo', maxCount: 1 },
    { name: 'orangeLogo', maxCount: 1 },
    { name: 'moovLogo', maxCount: 1 },
    { name: 'storyImage', maxCount: 1 },
    { name: 'storyVideo', maxCount: 1 },
    { name: 'storyImage2', maxCount: 1 },
    { name: 'storyImage3', maxCount: 1 }
  ])(req, res, err => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}

router.post('/logos', adminAuth, settingsUpload, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();

    if (req.files && Array.isArray(req.files.siteLogo) && req.files.siteLogo[0]) {
     settings.siteLogoUrl = req.files.siteLogo[0].path;
    }
    if (req.files && Array.isArray(req.files.waveLogo) && req.files.waveLogo[0]) {
      settings.waveLogoUrl = req.files.waveLogo[0].path;
    }
    if (req.files && Array.isArray(req.files.orangeLogo) && req.files.orangeLogo[0]) {
      settings.orangeLogoUrl = req.files.orangeLogo[0].path;
    }
    if (req.files && Array.isArray(req.files.moovLogo) && req.files.moovLogo[0]) {
      settings.moovLogoUrl = req.files.moovLogo[0].path;
    }
    if (req.files && Array.isArray(req.files.storyImage) && req.files.storyImage[0]) {
      settings.storyImageUrl = req.files.storyImage[0].path;
    }
    if (req.files && Array.isArray(req.files.storyVideo) && req.files.storyVideo[0]) {
      settings.storyVideoUrl = req.files.storyVideo[0].path;
    }
    if (req.files && Array.isArray(req.files.storyImage2) && req.files.storyImage2[0]) {
      settings.storyImage2Url = req.files.storyImage2[0].path;
    }
    if (req.files && Array.isArray(req.files.storyImage3) && req.files.storyImage3[0]) {
      settings.storyImage3Url = req.files.storyImage3[0].path;
    }

    settings.updatedAt = new Date();
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
