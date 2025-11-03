# 🍛 Restaurant - Application Web de Commande de Plats

Application web complète pour un restaurant africain permettant la commande en ligne avec gestion du panier et authentification des utilisateurs.

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Structure du projet](#structure-du-projet)
- [API Routes](#api-routes)
- [Sécurité](#sécurité)
- [Contribution](#contribution)

## ✨ Fonctionnalités

### Pour les clients
- ✅ Inscription et connexion sécurisées
- ✅ Navigation du menu avec recherche et filtres
- ✅ Ajout/modification/suppression d'articles au panier
- ✅ Passage de commande avec informations de livraison
- ✅ Historique des commandes
- ✅ Sessions persistantes

### Pour les administrateurs
- ✅ Gestion des commandes (statuts, suivi)
- ✅ Tableau de bord des commandes
- ✅ Gestion des produits

## 🛠 Technologies utilisées

### Backend
- **Node.js** & **Express 5** - Framework serveur
- **Prisma ORM** - Gestion de base de données
- **SQLite** - Base de données (dev), facilement remplaçable par PostgreSQL/MySQL
- **Passport.js** - Authentification (stratégie locale)
- **bcrypt** - Hachage des mots de passe

### Frontend
- **Handlebars** - Moteur de templates
- **Vanilla JavaScript** (ES6 Modules)
- **CSS3** (avec design responsive)

### Sécurité
- **Helmet** - Headers de sécurité HTTP
- **express-session** + **MemoryStore** - Gestion des sessions
- **CORS** - Protection CORS
- **Validation** - Côté client ET serveur

### Utilitaires
- **compression** - Compression Gzip
- **dotenv** - Variables d'environnement
- **nodemon** - Rechargement automatique (dev)

## 📦 Prérequis

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git** (optionnel, pour cloner le repo)

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone https://github.com/kevintiam/restaurant.git
cd restaurant
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Créer la base de données et exécuter les migrations
npx prisma migrate dev --name init

# Insérer les données de test
npm run seed
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet (utilisez `.env.example` comme modèle) :

```env
# Serveur
PORT=3000
NODE_ENV=development

# Base de données
DATABASE_URL="file:./dev.db"

# Session (⚠️ Changez en production !)
SESSION_SECRET="votre-secret-super-securise-et-aleatoire"
PACKAGE_NAME=restaurant
```

### Sécurité importante
- ⚠️ **Ne commitez JAMAIS le fichier `.env`** (déjà dans `.gitignore`)
- 🔑 Générez un `SESSION_SECRET` unique et complexe pour la production
- 🔒 Passez `NODE_ENV=production` en production

## 🏃 Démarrage

### Mode développement

```bash
npm run dev
```

Le serveur démarre sur **http://localhost:3000**

### Mode production

```bash
npm start
```

## 📁 Structure du projet

```
restaurant/
├── middlewares/           # Middlewares personnalisés
│   ├── auth.js           # Authentification (userAuth, userAuthAdmin, etc.)
│   ├── validation.js     # Validation des requêtes
│   ├── errorHandler.js   # Gestion centralisée des erreurs
│   └── rateLimiter.js    # Configuration rate limiting
├── model/                # Modèles de données
│   └── restaurant.js     # Logique métier (produits, panier, commandes)
├── prisma/               # Configuration Prisma
│   ├── schema.prisma     # Schéma de la base de données
│   └── migrations/       # Historique des migrations
├── public/               # Fichiers statiques
│   ├── css/             # Feuilles de style
│   ├── js/              # Scripts frontend
│   │   ├── api.js       # Appels API
│   │   ├── validation.js # Validation côté client
│   │   ├── menu.js      # Gestion du menu
│   │   ├── panier.js    # Gestion du panier
│   │   └── login.js     # Authentification
│   └── images/          # Images des produits
├── views/               # Templates Handlebars
│   ├── layouts/         # Layouts principaux
│   ├── partials/        # Composants réutilisables
│   └── *.handlebars     # Pages
├── auth.js              # Configuration Passport.js
├── csp-options.js       # Configuration Content Security Policy
├── routes.js            # Définition des routes
├── seed.js              # Script de peuplement de la BD
├── server.js            # Point d'entrée de l'application
├── .env.example         # Exemple de configuration
└── package.json         # Dépendances et scripts
```

## 🛣 API Routes

### Authentification
| Méthode | Route | Protection | Description |
|---------|-------|------------|-------------|
| `POST` | `/user/create` | - | Créer un compte |
| `POST` | `/user/login` | - | Se connecter |
| `POST` | `/user/logout` | `userAuth` | Se déconnecter |

### Menu & Produits
| Méthode | Route | Protection | Description |
|---------|-------|------------|-------------|
| `GET` | `/menu` | - | Liste des produits |

### Panier
| Méthode | Route | Protection | Description |
|---------|-------|------------|-------------|
| `POST` | `/panier/ajouter` | `userAuth` | Ajouter un produit |
| `GET` | `/panier/all` | `userAuth` | Voir le panier |
| `PUT` | `/panier/update/:id` | `userAuth` | Modifier quantité |
| `DELETE` | `/panier/supprimer/:id` | `userAuth` | Retirer un produit |
| `DELETE` | `/panier/vider` | `userAuth` | Vider le panier |
| `GET` | `/panier/total-items` | `userAuth` | Total d'articles |

### Commandes
| Méthode | Route | Protection | Description |
|---------|-------|------------|-------------|
| `POST` | `/commande/soumettre` | `userAuth` | Passer une commande |
| `GET` | `/commandes` | `userAuthAdmin` | Liste des commandes (admin) |
| `PUT` | `/commande/:id` | `userAuthAdmin` | Modifier statut (admin) |

### Pages
| Méthode | Route | Protection | Description |
|---------|-------|------------|-------------|
| `GET` | `/` | - | Page d'accueil |
| `GET` | `/login` | - | Page de connexion |
| `GET` | `/panier` | - | Page panier |
| `GET` | `/menu` | - | Page menu |

## 🔒 Sécurité

### Mesures implémentées

- ✅ **Helmet** - Protection headers HTTP
- ✅ **Hachage bcrypt** - Mots de passe (10 rounds)
- ✅ **Sessions sécurisées** - httpOnly, secure en prod
- ✅ **Validation double** - Client + Serveur
- ✅ **CSP** - Content Security Policy
- ✅ **Middlewares d'auth** - Protection routes sensibles
- ✅ **Gestion d'erreurs** - Pas de fuites d'info en production

### Recommandations production

```bash
# Installer express-rate-limit
npm install express-rate-limit

# Dans routes.js:
import rateLimit from 'express-rate-limit';
import { authLimiter } from './middlewares/rateLimiter.js';

const loginLimiter = rateLimit(authLimiter);
router.post('/user/login', loginLimiter, validerLogin, ...);
```

### Migration vers PostgreSQL (recommandé pour production)

```bash
# 1. Installer le client PostgreSQL
npm install pg

# 2. Modifier .env
DATABASE_URL="postgresql://user:password@localhost:5432/restaurant?schema=public"

# 3. Régénérer le client Prisma
npx prisma generate
npx prisma migrate dev
```

## 🧪 Tests

```bash
# Tests unitaires (à implémenter)
npm test
```

### Tests recommandés
- [ ] Tests unitaires (Jest + Supertest)
- [ ] Tests d'intégration API
- [ ] Tests E2E (Playwright/Cypress)
- [ ] Tests de validation

## 📝 Scripts disponibles

```bash
npm run dev          # Mode développement avec nodemon
npm start            # Mode production
npm run seed         # Peupler la base de données
npx prisma studio    # Interface graphique Prisma
npx prisma migrate   # Créer une migration
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit les changements (`git commit -m 'Ajout fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📄 Licence

UNLICENSED - Projet privé

## 👨‍💻 Auteur

**Kevin Tiam** - [GitHub](https://github.com/kevintiam)

## 🐛 Rapport de bugs

Ouvrez une issue sur [GitHub Issues](https://github.com/kevintiam/restaurant/issues)

---

⭐ Si ce projet vous aide, n'hésitez pas à lui donner une étoile !
