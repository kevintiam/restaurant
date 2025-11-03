# 🔐 Configuration de Passport.js

## ✅ Configuration complète

Votre application utilise maintenant **Passport.js** pour l'authentification !

---

## 📁 Fichiers configurés

### 1. **`auth.js`** - Configuration de Passport
```javascript
import passport from "passport";
import { Strategy } from "passport-local";
import { connexionUser, getUserById } from "./model/restaurant.js";

// Configuration de la stratégie locale
passport.use(
  new Strategy({
    usernameField: "courriel",
    passwordField: "mot_de_passe"
  }, async (courriel, mot_de_passe, done) => {
    // Logique d'authentification
  })
);

// Sérialisation : Enregistrer l'ID dans la session
passport.serializeUser((user, done) => {
  done(null, user.id_utilisateur);
});

// Désérialisation : Récupérer l'utilisateur depuis l'ID
passport.deserializeUser(async (id, done) => {
  const user = await getUserById(id);
  done(null, user);
});
```

### 2. **`server.js`** - Initialisation de Passport
```javascript
import passport from "passport";
import "./auth.js"; // Charger la configuration

// Configuration de la session (DOIT être avant passport)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  // ... autres options
}));

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());
```

### 3. **`routes.js`** - Utilisation de Passport

#### Route de connexion
```javascript
router.post("/user/login", validerLogin, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Erreur serveur" });
    }
    
    if (!user) {
      return res.status(401).json({ 
        error: info?.message || "Identifiants invalides" 
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Erreur de connexion" });
      }

      const { mot_de_passe, ...safeUser } = user;
      res.json({
        message: "Connexion réussie",
        user: safeUser,
        redirectUrl: "/"
      });
    });
  })(req, res, next);
});
```

#### Route de déconnexion
```javascript
router.post("/user/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Erreur de déconnexion" });
    }
    
    res.json({ message: "Déconnecté avec succès" });
  });
});
```

#### Vérifier la session
```javascript
router.get("/user/session", (req, res) => {
  if (req.isAuthenticated()) {
    const { mot_de_passe, ...safeUser } = req.user;
    res.json({
      isAuthenticated: true,
      user: safeUser
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});
```

### 4. **`middlewares/validation.js`** - Middleware de protection

```javascript
const requireAuth = (req, res, next) => {
  // Utilise req.isAuthenticated() fourni par Passport
  if (req.isAuthenticated()) {
    return next();
  }
  
  // Requête API ? Retourner JSON
  if (req.xhr || req.headers.accept.includes('json')) { 
    return res.status(401).json({ 
      error: "Non authentifié",
      redirectUrl: "/login" 
    });
  }
  
  // Sinon, rediriger
  res.redirect("/login");
};
```

---

## 🎯 Méthodes Passport disponibles

### Dans les routes protégées :

1. **`req.isAuthenticated()`** - Vérifie si l'utilisateur est connecté
   ```javascript
   if (req.isAuthenticated()) {
     console.log("Utilisateur connecté");
   }
   ```

2. **`req.user`** - Accède à l'utilisateur courant
   ```javascript
   const userName = req.user.nom;
   ```

3. **`req.login(user, callback)`** - Connecte manuellement un utilisateur
   ```javascript
   req.login(user, (err) => {
     if (err) return next(err);
     res.redirect("/");
   });
   ```

4. **`req.logout(callback)`** - Déconnecte l'utilisateur
   ```javascript
   req.logout((err) => {
     if (err) return next(err);
     res.redirect("/login");
   });
   ```

---

## 🔄 Flux d'authentification

### 1. **Connexion**
```
Client → POST /user/login (email, password)
    ↓
Passport vérifie avec la stratégie locale
    ↓
Si valide : req.login() → Session créée
    ↓
Réponse : { user, redirectUrl: "/" }
```

### 2. **Requête protégée**
```
Client → GET /panier (avec cookie de session)
    ↓
Middleware requireAuth vérifie req.isAuthenticated()
    ↓
Si true : Accès à req.user
    ↓
Si false : 401 ou redirect /login
```

### 3. **Déconnexion**
```
Client → POST /user/logout
    ↓
req.logout() détruit la session
    ↓
Réponse : { message: "Déconnecté" }
```

---

## 🚀 Avantages de Passport.js

✅ **Standard de l'industrie** - Utilisé par des millions d'applications  
✅ **Flexible** - Support de 500+ stratégies (Google, Facebook, JWT, etc.)  
✅ **Sécurisé** - Gestion automatique des sessions  
✅ **Maintenable** - Code propre et séparé  
✅ **Extensible** - Facile d'ajouter d'autres stratégies  

---

## 📚 Ressources

- [Documentation Passport](http://www.passportjs.org/)
- [Passport Local Strategy](http://www.passportjs.org/packages/passport-local/)
- [Guide Express + Passport](http://www.passportjs.org/tutorials/password/)

---

## ✨ Prochaines étapes possibles

1. Ajouter **Passport Google** pour OAuth
2. Ajouter **Passport JWT** pour une API REST
3. Implémenter **"Se souvenir de moi"** avec des cookies persistants
4. Ajouter **la réinitialisation de mot de passe**
