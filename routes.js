import { Router } from "express";
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
  connexionUser,
} from "./model/restaurant.js";
import {
  validerInfosClient,
  validerArticle,
  validerUpdate,
  validerID,
} from "./middlewares/validation.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = Router();

// Définition des routes
// route pour recuperer tous les produits
router.get("/all-products", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
    console.log(products);
  } catch (error) {
    console.error("❌ Erreur dans /allProducts :", error);
    res.status(500).json({ error: error.message });
  }
});
// route pour la page d'accueil
router.get("/", async (req, res) => {
  res.render("home", {
    title: "Menu",
    styles: [
      "./css/header.css",
      "./css/menu.css",
      "./css/home.css",
      "./css/about.css",
      "./css/panier.css",
    ],
    scripts: [
      "./js/header.js",
      "./js/menu.js",
      "./js/panier.js",
      "./js/recus.js",
    ],
    products: await getAllProducts(),
  });
});
//route pour voir les articles dans le panier
router.get("/panier", async (req, res) => {
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
      donneesPanier: await getContenuPanier(),
    });
  } catch (error) {
    res.status(500).send("Erreur lors du chargement du panier.");
  }
});
//route pour se connecter
router.get("/login", async (req, res) => {
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
    });
  } catch (error) {
    res.status(500).send("Erreur lors du chargement du panier.");
  }
});
// route pour ajouter un article au panier
router.post("/panier/ajouter", validerArticle, async (req, res) => {
  try {
    const { id_produit, quantite } = req.body;
    const produit = await addToPanier(id_produit, quantite);
    res.status(200).json({
      message: "Produit ajouté avec succès.",
      data: produit,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier :", error.message);
    res.status(500).json({
      message: "Erreur lors de l'ajout au panier : " + error.message,
    });
  }
});
router.put("/panier/update/:id", validerUpdate, async (req, res) => {
  try {
    const id = req.params.id;
    const { quantite } = req.body;
    const resultat = await updatePanierQuantity(id, quantite);

    res.status(200).json({
      message: `Article ${resultat.action} avec succès.`,
      data: resultat.item,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la quantité:",
      error.message
    );
    res.status(400).json({
      message: error.message,
    });
  }
});
// Route pour supprimer un article ou vider le panier (POST)
router.delete("/panier/supprimer/:id", validerID, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const articleSupprime = await removeToPanier(id);
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
    res.status(500).json({
      message: error.message || "Erreur lors de la suppression de l'article.",
    });
  }
});
// route pour recuperer le nombre total d'element
router.get("/panier/total-items", async (req, res) => {
  try {
    const totalItems = await getTotalItems();
    res.status(200).json({ totalItems: totalItems });
  } catch (error) {
    console.error("Erreur calcul total items:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
// route pour vider le panier
router.delete("/panier/vider", async (req, res) => {
  try {
    const message = await viderPanier();
    res.status(200).json({
      message: message,
    });
  } catch (error) {
    console.error("Erreur lors du vidage du panier:", error.message);
    res.status(500).json({
      message: error.message || "Erreur lors du vidage du panier.",
    });
  }
});
// router pour recuperer tous les articles du panier
router.get("/panier/all", async (req, res) => {
  try {
    const panier = await getContenuPanier();
    res.status(200).json(panier);
  } catch (error) {
    console.error("Erreur calcul total items:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});
// Route pour soumettre la commande (POST)
router.post("/commande/soumettre", validerInfosClient, async (req, res) => {
  try {
    const { adresse_livraison, nom_complet, telephone, courriel } = req.body;

    if (!adresse_livraison || !nom_complet || !telephone) {
      return res.status(400).json({
        message: "Adresse, nom complet et téléphone sont requis.",
      });
    }

    const panier = await getContenuPanier();
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
        items: await getContenuPanier(),
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
    res.status(500).json({
      message: error.message,
    });
  }
});
// route pour les commandes
router.get("/commandes", async (req, res) => {
  try {
    const etatsPossibles = await prisma.etatCommande.findMany();
    res.render("commandes", {
      title: "Gestion des Commandes",
      styles: ["./css/header.css"],
      scripts: ["./js/header.js"],
      commandes: await allCommande(),
      etats: etatsPossibles,
    });
  } catch (error) {
    res.status(500).send("Erreur lors du chargement des commandes.");
  }
});
// Route pour modifier le statut d'une commande (POST)
router.put("/commandes/statut/:id_commande", async (req, res) => {
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
    res.status(500).json({
      message: "Erreur interne du serveur",
    });
  }
});
// route pour ajouter un nouvel utilisateur
router.post("/user/add", async (req, res) => {
  try {
    const { nom, prenom, mot_de_passe, courriel, id_type_utilisateur } =
      req.body;

    if (!nom || !prenom || !mot_de_passe || !id_type_utilisateur || !courriel) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires" });
    }

    const newUser = await addUser(
      nom,
      prenom,
      mot_de_passe,
      id_type_utilisateur,
      courriel
    );

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur:", error.message);
    if (error.message.includes("Cet email est déjà utilisé.")) {
      return res.status(409).json({ message: error.message });
    }
    if (error.message.includes("Tous les champs sont obligatoires")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({
      message: error.message,
    });
  }
});
//route pour se connecter
router.post("/user/login", async (req, res) => {
  const { courriel, mot_de_passe } = req.body;
  if (!courriel || !mot_de_passe) {
     return res.status(400).json({ error: "Email et mot de passe requis" });
  }
    try {
    const user = await connexionUser(courriel);
    if(!user){
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe)

    if (!isMatch) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }
    const { password: _, ...safeUser } = user;
    res.json({ message: "Connexion réussie", user: safeUser });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
});
export default router;
