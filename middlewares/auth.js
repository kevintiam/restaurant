// Middleware pour vérifier si l'utilisateur est authentifié (utilisé dans les routes de l'API)
const userAuth = (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      return next();
    }
    
    // Gestion de l'échec d'authentification
    if (req.xhr || req.headers.accept?.includes('json')) { 
      return res.status(401).json({ 
        error: "Non authentifié", 
        message: "Vous devez être connecté pour accéder à cette ressource.",
        redirectUrl: "/login" 
      });
    }
    
    // Rediriger vers la page de connexion pour les requêtes non-API
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};

// Middleware pour vérifier si l'utilisateur est authentifié avec redirection
const userAuthRedirect = (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};

// Middleware pour vérifier si l'utilisateur est un administrateur
const userAuthAdmin = (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      if (req.user.id_type_utilisateur === 2) {
        return next();
      }
      return res.status(403).json({ error: "Accès refusé - Admin uniquement" });
    }
    res.status(403).json({ error: "Accès refusé" });
  } catch (error) {
    next(error);
  }
};

// Middleware pour vérifier si l'utilisateur est un administrateur avec redirection
const userAuthAdminRedirect = (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      if (req.user.id_type_utilisateur === 2) {
        return next();
      }
      return res.redirect("/login");
    }
    res.redirect("/login");
  } catch (error) {
    next(error);
  }
};

export { userAuth, userAuthRedirect, userAuthAdmin, userAuthAdminRedirect };
