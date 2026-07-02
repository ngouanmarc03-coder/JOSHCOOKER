const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  restaurantName: { type: String, default: 'Josua Cooker' },
  address: { type: String },
  phone: { type: String },
  whatsapp: { type: String },
  facebook: { type: String },
  tiktok: { type: String },
  snapchat: { type: String },
  waveNumber: { type: String },
  orangeNumber: { type: String },
  moovNumber: { type: String },
  waveLogoUrl: { type: String, default: '' },
  orangeLogoUrl: { type: String, default: '' },
  moovLogoUrl: { type: String, default: '' },
  siteLogoUrl: { type: String, default: '' },
  mapEmbedUrl: { type: String },
  specialClientThreshold: { type: Number, default: 10 },
  storyTitle: { type: String, default: 'Notre histoire' },
  storySubtitle: { type: String, default: 'Découvrez la passion et la tradition derrière Josua Cooker' },
  storyButtonLabel: { type: String, default: 'Lire l’histoire' },
  storyText: { type: String, default: 'Ajoutez ici l’histoire du restaurant, du chef ou de votre passion.' },
  storyDetails: { type: String, default: '' },
  storyImageUrl: { type: String, default: '' },
  storyVideoUrl: { type: String, default: '' },
  storyImage2Url: { type: String, default: '' },
  storyImage3Url: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Settings', settingsSchema);
