// Chargement des variables d'environnement depuis le fichier .env
import "dotenv/config";

// Importation des modules nécessaires
import express, { json } from "express";
import session from 'express-session'
import memorystore from 'memorystore'
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import routeExterne from "./routes.js";
import cspOptions from "./csp-options.js";
import { engine } from 'express-handlebars';
import passport from "passport";
import './auth.js';
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler.js";


// Création du serveur
const app = express();

// Configuration d'engin de rendu
app.engine('handlebars', engine({
  helpers: {
    eq: (a, b) => a === b
  }
}));     // definir le moteur de template Handlebars avec helpers
app.set('view engine', 'handlebars');   // definition de l'extention
app.set("views", "./views");            // definition du dossier des vues
const MemoryStore = memorystore(session);

// Ajout de middlewares
app.use(helmet(cspOptions));
app.use(compression());
app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true }));

// Configuration de la session
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Clé secrète pour signer le cookie de session
    resave: false,
    saveUninitialized: false, // Ne pas enregistrer les sessions non modifiées
    name: process.env.PACKAGE_NAME || "session_id", // Nom du cookie de session
    rolling: true, // Renouvelle la session à chaque requête
    store: new MemoryStore({ checkPeriod: 3600000 }), // nettoyage toutes les heures
    cookie: {
      secure: process.env.NODE_ENV === "production", // true en production (HTTPS)
      httpOnly: true, // Empêche l'accès au cookie via JavaScript côté client
      maxAge: 3600000, // 1 heures
    },
  })
);

// Initialisation de Passport.js pour l'authentification
app.use(passport.initialize());
app.use(passport.session());

// Définition du dossier des fichiers statiques
app.use(express.static("public"));
app.use(routeExterne);

// Middlewares de gestion d'erreurs
app.use(notFoundHandler);
app.use(errorHandler);

// Démarrage du serveur
app.listen(process.env.PORT);
console.log(`Le serveur démarré sur le port ${process.env.PORT}`);
console.log(`http://localhost:${process.env.PORT}`);
