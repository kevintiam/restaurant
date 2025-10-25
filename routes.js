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
} from "./model/restaurant.js";
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
    ],
    scripts: ["./js/header.js", "./js/menu.js"],
    products: await getAllProducts(),
  });
});

//route pour voir les articles dans le panier
router.get("/panier", (req, res) => {
  try {
    const donneesPanier = getContenuPanier();
    res.render("panier", {
      title: "Panier",
      styles: ["./css/header.css"],
      scripts: ["./js/header.js"],
      ...donneesPanier,
    });
  } catch (error) {
    res.status(500).send("Erreur lors du chargement du panier.");
  }
});

// route pour ajouter un article au panier
router.post("/panier/ajouter", async (req, res) => {
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

// Route pour supprimer un article ou vider le panier (POST)
router.delete("/panier/supprimer/:id", async (req, res) => {
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

// route pour vider le panier
router.delete("/panier/vider", async (req, res) => {
  try {
    viderPanier();
    res.status(200).json({
      message: "Panier vider avec succes",
    });
  } catch (error) {
    console.error("Erreur lors du vidage du panier:", error.message);
    res.status(500).json({
      message: error.message || "Erreur lors du vidage du panier.",
    });
  }
});

// Route pour soumettre la commande (POST)
router.post("/commande/soumettre", async (req, res) => {
  const { adresse_livraison } = req.body;
  try {
    const commande = await passerCommande(adresse_livraison);
    res.status(201).json({
      message: "Commande passer avec succes",
      data: commande,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la soumission de la commande:",
      error.message
    );
    res.status(500).json({
      message: error,
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
    const id_commande = req.params.id;
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

export default router;
