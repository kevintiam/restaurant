/**
 * Configuration des limiteurs de taux (rate limiters)
 * Protège contre les attaques par force brute et le spam
 * 
 * Note: express-rate-limit doit être installé
 * npm install express-rate-limit
 */

/**
 * Limiteur pour les routes d'authentification (login, register)
 * Plus strict car ce sont des cibles d'attaques par force brute
 */
const authLimiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Maximum 5 tentatives par fenêtre
  message: {
    error: true,
    message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
  },
  standardHeaders: true, // Retourner les infos dans les headers `RateLimit-*`
  legacyHeaders: false, // Désactiver les headers `X-RateLimit-*`
  skipSuccessfulRequests: false, // Compter même les requêtes réussies
  skipFailedRequests: false, // Compter aussi les échecs
};

/**
 * Limiteur pour les routes API générales
 * Plus permissif pour les opérations normales
 */
const apiLimiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Maximum 100 requêtes par fenêtre
  message: {
    error: true,
    message: 'Trop de requêtes. Veuillez réessayer plus tard.',
  },
  standardHeaders: true,
  legacyHeaders: false,
};

/**
 * Limiteur strict pour les opérations sensibles (création de commande, paiement)
 */
const strictLimiter = {
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Maximum 10 requêtes par fenêtre
  message: {
    error: true,
    message: 'Trop de tentatives. Veuillez patienter quelques minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
};

/**
 * Fonction helper pour créer un rate limiter
 * À utiliser quand express-rate-limit est installé
 * 
 * Exemple d'utilisation dans routes.js:
 * 
 * import rateLimit from 'express-rate-limit';
 * import { authLimiter, apiLimiter } from './middlewares/rateLimiter.js';
 * 
 * const loginLimiter = rateLimit(authLimiter);
 * router.post('/user/login', loginLimiter, ...);
 */

export { authLimiter, apiLimiter, strictLimiter };
