/**
 * Middleware de gestion des erreurs 404 (route non trouvée)
 */
const notFoundHandler = (req, res) => {
  const statusCode = 404;
  
  // Réponse JSON pour les requêtes API
  if (req.xhr || req.headers.accept?.includes('json')) {
    return res.status(statusCode).json({
      error: true,
      message: 'Route non trouvée',
      path: req.originalUrl,
    });
  }
  
  // Réponse HTML pour les requêtes de page
  res.status(statusCode).send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Erreur 404</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #e74c3c; font-size: 4em; margin: 0; }
        h2 { color: #333; margin: 10px 0; }
        p { color: #666; margin: 20px 0; }
        a { color: #3498db; text-decoration: none; font-weight: bold; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>404</h1>
        <h2>Page non trouvée</h2>
        <p>La page <code>${req.originalUrl}</code> n'existe pas.</p>
        <a href="/">← Retour à l'accueil</a>
      </div>
    </body>
    </html>
  `);
};

/**
 * Middleware global de gestion d'erreurs
 * Doit être utilisé en dernier, après toutes les routes
 */
const errorHandler = (err, req, res, next) => {
  // Logger l'erreur côté serveur
  console.error('🔴 Erreur détectée:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Déterminer le code de statut
  const statusCode = err.status || err.statusCode || 500;

  // Réponse en fonction du type de requête
  if (req.xhr || req.headers.accept?.includes('json')) {
    // Réponse JSON pour les requêtes API
    return res.status(statusCode).json({
      error: true,
      message: process.env.NODE_ENV === 'production' 
        ? 'Une erreur est survenue' 
        : err.message,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack,
        details: err.details || undefined,
      }),
    });
  }

  // Réponse HTML pour les requêtes de page
  res.status(statusCode).send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Erreur ${statusCode}</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #e74c3c; font-size: 3em; margin: 0; }
        h2 { color: #333; margin: 10px 0; }
        p { color: #666; margin: 20px 0; line-height: 1.6; }
        .error-details { background: #f8f9fa; padding: 15px; border-radius: 5px; text-align: left; margin: 20px 0; font-family: monospace; font-size: 0.9em; overflow-x: auto; }
        a { color: #3498db; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 20px; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Erreur ${statusCode}</h1>
        <h2>Oups ! Quelque chose s'est mal passé</h2>
        <p>${process.env.NODE_ENV === 'production' ? 'Une erreur est survenue. Veuillez réessayer plus tard.' : err.message}</p>
        ${process.env.NODE_ENV === 'development' ? `
          <div class="error-details">
            <strong>Détails techniques :</strong><br>
            ${err.stack ? err.stack.replace(/\n/g, '<br>') : 'Aucun détail disponible'}
          </div>
        ` : ''}
        <a href="/">← Retour à l'accueil</a>
      </div>
    </body>
    </html>
  `);
};

export { notFoundHandler, errorHandler };
