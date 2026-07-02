# Josua Cooker - Site E-commerce Restaurant Ivoirien

## Lancement rapide

### Prérequis
- Node.js (v16+)
- MongoDB installé et démarré

### 1. Démarrer MongoDB
```bash
mongod
```

### 2. Backend
```bash
cd backend
npm install
npm run dev
```
Le serveur démarre sur http://localhost:5000

### 3. Frontend (dans un autre terminal)
```bash
cd frontend
npm install
npm run dev
```
Le site s'ouvre sur http://localhost:3000

---

## Connexion Admin
- **Email :** admin@josuacooker.ci
- **Mot de passe :** admin2024
- **URL Admin :** http://localhost:3000/pages/admin/dashboard.html

---

## Structure du projet

```
josua-cooker/
├── backend/
│   ├── models/         # User, Hero, Menu, Event, Order, Settings
│   ├── routes/         # auth, heroes, menus, events, orders, settings, users
│   ├── middleware/     # auth.js (JWT), upload.js (Multer)
│   ├── uploads/        # Fichiers uploadés (images/vidéos)
│   └── server.js
├── frontend/
│   ├── css/
│   │   ├── style.css   # Style principal (blanc/vert/or)
│   │   └── admin.css   # Style panneau admin
│   ├── js/
│   │   └── app.js      # Logique globale, panier, auth
│   ├── pages/
│   │   ├── admin/      # dashboard, heroes, menus, events, orders, users, settings
│   │   ├── menu.html
│   │   ├── checkout.html
│   │   ├── account.html
│   │   ├── auth.html
│   │   ├── contact.html
│   │   ├── privacy.html
│   │   └── terms.html
│   └── index.html      # Page d'accueil
```

---

## Fonctionnalités

### Site client
- **Hero principal** : photo/vidéo gérée par l'admin, bouton vers le menu
- **Menu** : grille avec filtres par catégorie, recherche en temps réel
- **Chaque plat** : 2 images + vidéo optionnelle, badges Promo/Nouveau
- **Panier flottant** : drawer avec quantités, total, bouton commander
- **Checkout** : formulaire + choix paiement Wave/Orange/Moov
- **Google Maps** : carte du restaurant configurable
- **Hero événements** : section promos avec image/vidéo
- **Bouton social flottant** : draggable, WhatsApp/Facebook/TikTok/Snapchat
- **Mode sombre** : toggle en haut à droite
- **Responsive** : 100% adapté mobile

### Compte client
- Inscription → validation admin → connexion
- Suivi des commandes
- Progression vers Client Spécial (barre de progression)
- Espace Client Spécial (débloqué par code secret de l'admin)
  → Avantages exclusifs, réductions, priorité

### Panneau Admin
- **Tableau de bord** : statistiques, commandes récentes
- **Heroes & Médias** : ajout/modification/suppression d'images et vidéos (hero principal, événement, spécial)
- **Produits/Menu** : créer/modifier plats avec 2 images + vidéo, prix, promo, catégorie
- **Événements** : gérer le hero événement avec image/vidéo, réduction affichée
- **Commandes** : voir toutes les commandes, changer le statut, voir détails
- **Clients** : valider comptes, envoyer codes VIP clients spéciaux
- **Paramètres** : infos restaurant, réseaux sociaux, numéros paiement, Google Maps

### Paiement
- Wave CI, Orange Money CI, Moov Money CI
- Dépôt après commande sur le numéro affiché
- Validation admin après vérification
- Coordonnées commande = coordonnées dépôt (sécurité)

---

## Technologies
- **Frontend** : HTML5, CSS3, JavaScript Vanilla
- **Backend** : Node.js + Express.js
- **Base de données** : MongoDB + Mongoose
- **Uploads** : Multer (images/vidéos jusqu'à 100MB)
- **Auth** : JWT + bcrypt
- **Couleurs** : Blanc, Vert (#2E8B3D), Or (#D4A017)
