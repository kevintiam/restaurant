import { Router } from "express";
import passport from "passport";
import {
  getAllProducts,
  addToPanier,
  removeToPanier,
  viderPanier,
  passerCommande,
  allCommande,
  updateCommande,
  getContenuPanier,
  updatePanierQuantity,
  getTotalItems,
  calculateOrderTotals,
  getTypeUser,
  addUser,
} from "./model/restaurant.js";
import {
  validerInfosClient,
  validerArticle,
  validerUpdate,
  validerID,
  validerInfosUtilisateur,
  validerLogin,
} from "./middlewares/validation.js";
import { userAuth, userAuthRedirect, userAuthAdmin } from "./middlewares/auth.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = Router();

// Définition des routes
// route pour recuperer tous les produits
router.get("/all-products", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
    console.log(products);
  } catch (error) {
    console.error("❌ Erreur dans /allProducts :", error);
    next(error);
  }
});
// route pour la page d'accueil
router.get("/", async (req, res, next) => {
  try {
    res.render("home", {
      title: "Menu",
      styles: [
        "./css/header.css",
        "./css/menu.css",
        "./css/home.css",
        "./css/about.css",
        "./css/panier.css",
        "./css/contact.css",
        "./css/scroll.css",
      ],
      scripts: [
        "./js/header.js",
        "./js/menu.js",
        "./js/panier.js",
        "./js/recus.js",
        "./js/scroll.js",
      ],
      products: await getAllProducts(),
      user: req.user,
      isAdmin: req.user && req.user.id_type_utilisateur === 2,
    });
  } catch (error) {
    next(error);
  }
});
//route pour voir les articles dans le panier
router.get("/panier", userAuth, async (req, res, next) => {
  try {
    res.render("panier", {
      title: "Panier",
      styles: [
        "./css/header.css",
        "./css/menu.css",
        "./css/home.css",
        "./css/about.css",
        "./css/panier.css",
        "./css/recu.css",
      ],
      scripts: [
        "./js/header.js",
        "./js/menu.js",
        "./js/panier.js",
        "./js/recus.js",
      ],
      donneesPanier: await getContenuPanier(req),
      user: req.user,
      isAdmin: req.user && req.user.id_type_utilisateur === 2,
    });
  } catch (error) {
    next(error);
  }
});
//route pour acceder a la page de login pour se connecter
router.get("/login", async (req, res, next) => {
  try {
    res.render("login", {
      title: "Login",
      styles: [
        "./css/header.css",
        "./css/menu.css",
        "./css/home.css",
        "./css/about.css",
        "./css/panier.css",
        "./css/recu.css",
        "./css/login.css",
      ],
      scripts: [
        "./js/header.js",
        "./js/menu.js",
        "./js/panier.js",
        "./js/recus.js",
        "./js/login.js",
      ],
      type: await getTypeUser(),
      user: req.user,
      isAdmin: req.user && req.user.id_type_utilisateur === 2,
    });
  } catch (error) {
    next(error);
  }
});
// route pour ajouter un article au panier
router.post(
  "/panier/ajouter",
  userAuth,
  validerArticle,
  async (req, res, next) => {
    try {
      const { id_produit, quantite } = req.body;
      const produit = await addToPanier(req, id_produit, quantite);
      res.status(200).json({
        message: "Produit ajouté avec succès.",
        data: produit,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier :", error.message);
      next(error);
    }
  }
);
router.put(
  "/panier/update/:id",
  userAuth,
  validerUpdate,
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const { quantite } = req.body;
      const resultat = await updatePanierQuantity(req, id, quantite);

      res.status(200).json({
        message: `Article mis à jour avec succès.`,
        data: resultat,
      });
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de la quantité:",
        error.message
      );
      next(error);
    }
  }
);
// Route pour supprimer un article ou vider le panier
router.delete(
  "/panier/supprimer/:id",
  userAuth,
  validerID,
  async (req, res, next) => {
    try {
      const id = parseInt(req.params.id);
      const articleSupprime = await removeToPanier(req, id);
      if (articleSupprime) {
        res.status(200).json({
          message: `Article '${articleSupprime.nom}' supprimé avec succès`,
        });
      } else {
        res.status(400).json({
          message: "erreur lors de la suppression de l'article",
        });
      }
    } catch (error) {
      console.error("Erreur de suppression:", error.message);
      next(error);
    }
  }
);
// route pour recuperer le nombre total d'element
router.get("/panier/total-items", userAuth, async (req, res, next) => {
  try {
    const totalItems = getTotalItems(req);
    res.status(200).json({ totalItems: totalItems });
  } catch (error) {
    console.error("Erreur calcul total items:", error);
    next(error);
  }
});
// route pour vider le panier
router.delete("/panier/vider", userAuth, async (req, res, next) => {
  try {
    const message = await viderPanier(req);
    res.status(200).json({
      message: message,
    });
  } catch (error) {
    console.error("Erreur lors du vidage du panier:", error.message);
    next(error);
  }
});
// router pour recuperer tous les articles du panier
router.get("/panier/all", userAuth, async (req, res, next) => {
  try {
    const panier = await getContenuPanier(req);
    res.status(200).json(panier);
  } catch (error) {
    console.error("Erreur calcul total items:", error);
    next(error);
  }
});
// Route pour soumettre la commande
router.post(
  "/commande/soumettre",
  userAuth,
  validerInfosClient,
  async (req, res, next) => {
    try {
      const { adresse_livraison, nom_complet, telephone, courriel } = req.body;

      if (!adresse_livraison || !nom_complet || !telephone) {
        return res.status(400).json({
          message: "Adresse, nom complet et téléphone sont requis.",
        });
      }

      const panier = await getContenuPanier(req);
      if (panier.length === 0) {
        return res.status(400).json({
          message: "Le panier est vide. Impossible de soumettre la commande.",
        });
      }

      const TAXE_RATE = 0.2;
      const SHIPPING_COST = 0.1;
      const itemsPourRecu = await calculateOrderTotals(
        panier,
        TAXE_RATE,
        SHIPPING_COST
      );

      const commandeDB = await passerCommande(
        req,
        adresse_livraison,
        nom_complet,
        telephone,
        courriel
      );

      res.status(201).json({
        message: "Commande passée avec succès",
        order: {
          id: commandeDB.reference_commande,
          date: new Date(commandeDB.date).toLocaleString("fr-CA"),
          nomClient: nom_complet,
          telephone: telephone,
          adresse: adresse_livraison,
          items: panier,
          sousTotal: itemsPourRecu.sousTotal,
          taxes: itemsPourRecu.taxe,
          transport: itemsPourRecu.transport,
          total: itemsPourRecu.totalFinal,
          courriel: courriel,
        },
      });
    } catch (error) {
      console.error(
        "Erreur lors de la soumission de la commande:",
        error.message
      );
      next(error);
    }
  }
);
// route pour les commandes
router.get("/commandes", async (req, res, next) => {
  try {
    const etatsPossibles = await prisma.etatCommande.findMany();
    res.render("commandes", {
      title: "Gestion des Commandes",
      styles: ["./css/header.css"],
      scripts: ["./js/header.js"],
      commandes: await allCommande(),
      etats: etatsPossibles,
      user: req.user,
      isAdmin: req.user && req.user.id_type_utilisateur === 2,
    });
  } catch (error) {
    next(error);
  }
});
// Route pour modifier le statut d'une commande (réservée aux administrateurs)
router.put("/commandes/statut/:id_commande", userAuthAdmin, async (req, res, next) => {
  try {
    const id_commande = parseInt(req.params.id_commande);
    const { id_etat_commande } = req.body;

    if (isNaN(id_commande) || id_commande <= 0) {
      return res.status(400).json({ message: "ID de commande invalide." });
    }

    const commande = await updateCommande(id_commande, id_etat_commande);
    res.status(200).json({
      message: "Commande mise à jour",
      data: commande,
    });
  } catch (error) {
    console.error("Échec de la mise à jour du statut:", error.message);
    next(error);
  }
});
// route pour ajouter un nouvel utilisateur
router.post("/user/add", validerInfosUtilisateur, async (req, res, next) => {
  try {
    const { nom, prenom, mot_de_passe, courriel, id_type_utilisateur } =
      req.body;
    const newUser = await addUser(
      nom,
      prenom,
      mot_de_passe,
      id_type_utilisateur,
      courriel
    );

    // Connecter automatiquement l'utilisateur après la création du compte
    req.login(newUser, (err) => {
      if (err) {
        // Si la connexion automatique échoue, retourner quand même le succès
        return res.status(201).json({ 
          message: "Compte créé avec succès. Veuillez vous connecter.",
          user: newUser 
        });
      }
      
      // Retirer le mot de passe avant d'envoyer la réponse
      const { mot_de_passe, ...safeUser } = newUser;
      
      res.status(201).json({
        message: "Compte créé avec succès ! Connexion automatique...",
        user: safeUser,
        redirectUrl: "/"
      });
    });
  } catch (error) {
    if (error.message.includes("Cet email est déjà utilisé.")) {
      return res.status(409).json({ message: error.message });
    }
    if (error.message.includes("Tous les champs sont obligatoires")) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});
//route pour se connecter
router.post("/user/login", validerLogin, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      next(err);
    }

    if (!user) {
      return res.status(401).json({
        error: info?.message || "Identifiants invalides",
      });
    }
    // Connexion de l'utilisateur via Passport
    req.logIn(user, (err) => {
      if (err) {
        next(err);
      }
      // Retourner l'utilisateur sans le mot de passe
      const { mot_de_passe, ...safeUser } = user;

      res.json({
        message: "Connexion réussie",
        user: safeUser,
        redirectUrl: "/",
      });
    });
  })(req, res, next);
});
// Route pour récupérer les infos de l'utilisateur connecté
router.get("/user/me", userAuth, (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    // Retirer le mot de passe avant d'envoyer la réponse
    const { mot_de_passe, ...safeUser } = req.user;
    
    res.status(200).json({
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
});

// Route pour se déconnecter
router.post("/user/logout", userAuth, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Déconnecté avec succès",
      redirectUrl: "/login",
    });
  });
});

export default router;
