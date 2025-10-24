// Chargement des variables d'environnement depuis le fichier .env
import "dotenv/config";

// Importation des modules nécessaires
import express, { json } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import routeExterne from "./routes.js";
import cspOptions from "./csp-options.js";
import { engine } from 'express-handlebars';

// Création du serveur
const app = express();

// Configuration d'engin de rendu
app.engine('handlebars', engine());     // definir le moteur de template Handlebars
app.set('view engine', 'handlebars');   // definition de l'extention
app.set("views", "./views");            // definition du dossier des vues

// Ajout de middlewares
app.use(helmet(cspOptions));
app.use(compression());
app.use(cors());
app.use(json());

// Définition du dossier des fichiers statiques
app.use(express.static("public"));
app.use(routeExterne);

// Renvoyer une erreur 404 pour les routes non définies
app.use((request, response) => {
    // Renvoyer simplement une chaîne de caractère indiquant que la page n'existe pas
    response.status(404).send(`${request.originalUrl} Route introuvable.`);
});

// Démarrage du serveur
app.listen(process.env.PORT);
console.log(`Le serveur démarré sur le port ${process.env.PORT}`);
console.log(`http://localhost:${process.env.PORT}`);
