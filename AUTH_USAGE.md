# 📚 Utilisation du module d'authentification (auth.js)

## 🎯 Fonctions disponibles

### 1. `authenticateUser(courriel, mot_de_passe)`
Authentifie un utilisateur avec son email et mot de passe.

**Paramètres :**
- `courriel` (string) : L'email de l'utilisateur
- `mot_de_passe` (string) : Le mot de passe en clair

**Retour :**
- `Promise<Object|null>` : L'utilisateur sans le mot de passe, ou `null` si échec

**Exemple :**
```javascript
import { authenticateUser } from "./auth.js";

const user = await authenticateUser("user@example.com", "Password123!");
if (user) {
  console.log("Authentification réussie:", user);
} else {
  console.log("Identifiants invalides");
}
```

---

### 2. `createUserSession(req, user)`
Crée une session pour l'utilisateur connecté.

**Paramètres :**
- `req` (Object) : L'objet request Express
- `user` (Object) : L'utilisateur à mettre en session

**Exemple :**
```javascript
import { createUserSession } from "./auth.js";

router.post("/login", async (req, res) => {
  const user = await authenticateUser(req.body.email, req.body.password);
  if (user) {
    createUserSession(req, user);
    res.json({ message: "Connexion réussie" });
  }
});
```

---

### 3. `destroyUserSession(req)`
Détruit la session de l'utilisateur (déconnexion).

**Paramètres :**
- `req` (Object) : L'objet request Express

**Retour :**
- `Promise<void>`

**Exemple :**
```javascript
import { destroyUserSession } from "./auth.js";

router.post("/logout", async (req, res) => {
  try {
    await destroyUserSession(req);
    res.clearCookie("connect.sid");
    res.json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ error: "Erreur de déconnexion" });
  }
});
```

---

### 4. `isAuthenticated(req)`
Vérifie si l'utilisateur est authentifié.

**Paramètres :**
- `req` (Object) : L'objet request Express

**Retour :**
- `boolean` : `true` si authentifié, `false` sinon

**Exemple :**
```javascript
import { isAuthenticated } from "./auth.js";

router.get("/profile", (req, res) => {
  if (isAuthenticated(req)) {
    res.render("profile", { user: req.session.user });
  } else {
    res.redirect("/login");
  }
});
```

---

### 5. `getCurrentUser(req)`
Récupère l'utilisateur courant depuis la session.

**Paramètres :**
- `req` (Object) : L'objet request Express

**Retour :**
- `Object|null` : L'utilisateur ou `null` si non connecté

**Exemple :**
```javascript
import { getCurrentUser } from "./auth.js";

router.get("/api/user/me", (req, res) => {
  const user = getCurrentUser(req);
  if (user) {
    res.json({ user });
  } else {
    res.status(401).json({ error: "Non authentifié" });
  }
});
```

---

## 🚀 Exemple complet dans routes.js

```javascript
import { Router } from "express";
import {
  authenticateUser,
  createUserSession,
  destroyUserSession,
  getCurrentUser,
  isAuthenticated as checkAuth
} from "./auth.js";

const router = Router();

// Route de connexion
router.post("/login", async (req, res) => {
  const { courriel, mot_de_passe } = req.body;
  
  try {
    const user = await authenticateUser(courriel, mot_de_passe);
    
    if (!user) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    createUserSession(req, user);
    
    res.json({
      message: "Connexion réussie",
      user: user,
      redirectUrl: "/"
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route de déconnexion
router.post("/logout", async (req, res) => {
  try {
    await destroyUserSession(req);
    res.clearCookie("connect.sid");
    res.json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ error: "Erreur de déconnexion" });
  }
});

// Route pour vérifier la session
router.get("/session", (req, res) => {
  if (checkAuth(req)) {
    const user = getCurrentUser(req);
    res.json({ isAuthenticated: true, user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

export default router;
```

---

## ✅ Avantages de cette architecture

1. **Réutilisabilité** : Les fonctions peuvent être utilisées dans n'importe quelle route
2. **Maintenabilité** : La logique d'authentification est centralisée
3. **Testabilité** : Facile à tester unitairement
4. **Clarté** : Code plus lisible et organisé
5. **Sécurité** : L'utilisateur retourné ne contient jamais le mot de passe
