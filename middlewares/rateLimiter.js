/**
 * Configuration des rate limiters pour protéger l'API contre les abus
 * Utilise express-rate-limit pour limiter le nombre de requêtes par IP
 */

// Configuration pour les routes d'authentification (login, register)
// Protection contre les attaques par force brute
export const authLimiter = {
  windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
  max: 5, // Maximum 5 tentatives par fenêtre
  message: {
    error: true,
    message:
      "Trop de tentatives de connexion depuis cette adresse IP. Veuillez réessayer dans 15 minutes.",
  },
  standardHeaders: true, // Retourne les informations de limite dans les headers `RateLimit-*`
  legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
  skipSuccessfulRequests: false, // Compte aussi les requêtes réussies
  skipFailedRequests: false, // Compte aussi les requêtes échouées
};

// Configuration pour les routes API générales (panier, produits)
// Protection contre l'utilisation excessive de l'API
export const apiLimiter = {
  windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
  max: 100, // Maximum 100 requêtes par fenêtre
  message: {
    error: true,
    message:
      "Trop de requêtes depuis cette adresse IP. Veuillez réessayer dans 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
};

// Configuration stricte pour les opérations critiques (soumission de commande)
// Limite très basse pour prévenir les abus sur les transactions
export const strictLimiter = {
  windowMs: 10 * 60 * 1000, // Fenêtre de 10 minutes
  max: 10, // Maximum 10 commandes par fenêtre
  message: {
    error: true,
    message:
      "Trop de commandes soumises. Veuillez réessayer dans 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
};

/**
 * UTILISATION DANS routes.js :
 * 
 * import rateLimit from 'express-rate-limit';
 * import { authLimiter, apiLimiter, strictLimiter } from './middlewares/rateLimiter.js';
 * 
 * const loginLimiter = rateLimit(authLimiter);
 * const registerLimiter = rateLimit(authLimiter);
 * const panierLimiter = rateLimit(apiLimiter);
 * const commandeLimiter = rateLimit(strictLimiter);
 * 
 * router.post('/user/login', loginLimiter, validerLogin, ...);
 * router.post('/user/add', registerLimiter, validerInfosUtilisateur, ...);
 * router.post('/panier/ajouter', panierLimiter, userAuth, validerArticle, ...);
 * router.post('/commande/soumettre', commandeLimiter, userAuth, validerInfosClient, ...);
 */
