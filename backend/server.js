const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck Railway (OBLIGATOIRE)
app.get('/railway-health', (req, res) => {
  res.send('OK');
});

// Routes API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/heroes', require('./routes/heroes'));
app.use('/api/menus', require('./routes/menus'));
app.use('/api/events', require('./routes/events'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/users', require('./routes/users'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connecté avec succès');

    // Create default admin if not exists
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      const hash = await bcrypt.hash('admin2024', 10);
      await User.create({
        name: 'Administrateur',
        email: 'admin@josuacooker.ci',
        password: hash,
        phone: '+225 07 00 00 00 00',
        role: 'admin',
        isValidated: true
      });
      console.log('Admin créé: admin@josuacooker.ci / admin2024');
    }

    // Create default settings
    const Settings = require('./models/Settings');
    const settings = await Settings.findOne();
    if (!settings) {
      await Settings.create({
        restaurantName: 'Josua Cooker',
        address: 'Abidjan, Cote d Ivoire',
        phone: '+225 07 00 00 00 00',
        whatsapp: 'https://wa.me/2250700000000',
        facebook: 'https://facebook.com/josuacooker',
        tiktok: 'https://tiktok.com/@josuacooker',
        snapchat: 'https://snapchat.com/add/josuacooker',
        waveNumber: '+225 07 00 00 00 00',
        orangeNumber: '+225 05 00 00 00 00',
        moovNumber: '+225 01 00 00 00 00',
        mapEmbedUrl: 'https://maps.google.com/maps?q=Abidjan+Cote+d+Ivoire&output=embed',
        specialClientThreshold: 10,
        storyTitle: 'Notre histoire',
        storySubtitle: 'Découvrez la passion et la tradition derrière Josua Cooker',
        storyButtonLabel: 'Lire l’histoire',
        storyText: 'Ajoutez ici l’histoire du restaurant, du chef ou de votre passion.',
        storyDetails: ''
      });
      console.log('Paramètres par défaut créés');
    }

    const Order = require('./models/Order');
    try {
      await Order.collection.dropIndex('numeroCommande_1');
      console.log('Index numeroCommande_1 supprimé');
    } catch (dropErr) {
      if (dropErr.codeName !== 'IndexNotFound') {
        console.warn('Impossible de supprimer l’index numeroCommande_1:', dropErr.message);
      }
    }
  })
  .catch(err => console.error('Erreur MongoDB:', err));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
