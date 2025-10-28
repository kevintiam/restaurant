import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const panierTemporaire = [];

// --- FONCTIONS PRODUIT / MENU ---
const getAllProducts = async () => {
  return await prisma.produit.findMany();
};

// Fonction pour récupérer le contenu du panier
const getContenuPanier = async () => {
  const items = panierTemporaire;
  return items;
};

// fonction pour ajouter les produits au panier
const addToPanier = async (produitID, quantiteProduit) => {
  const idProduit = parseInt(produitID);
  const quantite = parseInt(quantiteProduit);

  if (isNaN(idProduit) || isNaN(quantite) || quantite <= 0) {
    throw new Error("ID produit ou quantité invalide.");
  }

  const produit = await prisma.produit.findUnique({
    where: { id_produit: idProduit },
  });

  if (!produit) {
    throw new Error("Produit non trouvé");
  }

  const item = panierTemporaire.find((p) => p.id_produit === idProduit);

  if (item) {
    item.quantite += quantite;
    return item;
  } else {
    const nouvelArticle = {
      id_produit: idProduit,
      quantite: quantite,
      nom: produit.nom,
      prix: produit.prix,
      image: produit.chemin_image,
      description: produit.description,
    };
    panierTemporaire.push(nouvelArticle);
    console.log(panierTemporaire);
    return nouvelArticle;
  }
};

// fonction pour retirer un produit du panier
const removeToPanier = async (produitID) => {
  const id = parseInt(produitID);

  if (!id) {
    throw new Error("ID produit invalide.", { cause: 400 });
  }

  const itemIdex = panierTemporaire.findIndex((p) => p.id_produit === id);
  if (itemIdex === -1) {
    throw new Error("Article introuvable ou inexistant dans le panier");
  }
  const articleDeleted = panierTemporaire.splice(itemIdex, 1);
  return articleDeleted[0];
};

// fonction pour vider le panier
const viderPanier = async () => {
  if (panierTemporaire.length === 0) {
    throw new Error("Le panier est déjà vide.");
  }
  panierTemporaire.length = 0;
  return { success: true, message: "Panier vidé avec succès." };
};

// fonction pour passer la commande (creer la commande)
const passerCommande = async (adresseLivraison) => {
  if (panierTemporaire.length === 0) {
    throw new Error("Impossible de soumettre : le panier est vide.");
  }
  try {
    const nouvelleCommande = await prisma.$transaction(async (tx) => {
      const commande = await tx.commande.create({
        data: {
          id_utilisateur: 1,
          id_etat_commande: 1,
          date: Date.now(),
          adresse_livraison: adresseLivraison,
        },
      });

      const produitsData = panierTemporaire.map((item) => ({
        id_commande: commande.id_commande,
        id_produit: item.id_produit,
        quantite: item.quantite,
      }));

      await tx.commandeProduit.createMany({
        data: produitsData,
      });

      return commande;
    });
    panierTemporaire.length = 0;

    return nouvelleCommande;
  } catch (error) {
    console.error("Erreur Prisma lors de la transaction de commande :", error);
    throw new Error("Échec de la création de la commande.");
  }
};

// fonction pour recuperer toutes les commandes
const allCommande = async () => {
  try {
    const commandes = await prisma.commande.findMany({
      orderBy: {
        date: "desc",
      },
      include: {
        etatCommande: true,
        utilisateur: true,
        CommandeProduit: {
          include: {
            produit: true,
          },
        },
      },
    });

    // Formater les données (calcul du total, formatage de la date)
    return commandes.map((commande) => {
      const total = commande.commandeProduits.reduce((sum, item) => {
        return sum + item.quantite * item.produit.prix;
      }, 0);

      return {
        ...commande,
        total: total.toFixed(2),
        dateFormatee: new Date(commande.date).toLocaleString("fr-FR"),
      };
    });
  } catch (error) {
    console.error("Erreur DB lors de la récupération des commandes:", error);
    throw new Error("Impossible de charger la liste des commandes.");
  }
};

// fonction pour mettre a jours la commande
const updateCommande = async (idCommande, newEtat) => {
  const id = parseInt(idCommande);
  const etat = parseInt(newEtat);

  if (isNaN(id) || isNaN(etat)) {
    throw new Error("ID de commande ou statut invalide.");
  }

  try {
    const commande = await prisma.commande.update({
      where: {
        id_commande: id,
      },
      data: { id_etat_commande: etat },
    });

    return commande;
  } catch (error) {
    console.error("Erreur DB lors de la mise à jour du statut:", error);

    if (error.code === "P2025") {
      throw new Error("Commande introuvable.");
    }
    throw new Error("Erreur lors de la mise à jour du statut.");
  }
};

const updatePanierQuantity = async (produitID, nouvelleQuantite) => {
  const id = parseInt(produitID);
  const quantite = parseInt(nouvelleQuantite);

  if (isNaN(id) || isNaN(quantite) || quantite < 0) {
    throw new Error("ID produit ou quantité invalide.");
  }
  console.log("Contenu actuel de panierTemporaire:", panierTemporaire);
  const panier = await getContenuPanier();

  const itemIndex = panier.findIndex((p) => p.id_produit === id);

  if (itemIndex === -1) {
    throw new Error("Article introuvable dans le panier.");
  }

  if (quantite === 0) {
    const [articleSupprime] = panierTemporaire.splice(itemIndex, 1);
    return articleSupprime;
  }

  panierTemporaire[itemIndex].quantite = quantite;

  return panierTemporaire[itemIndex];
};

const getTotalItems = () => {
  const totalItems = panierTemporaire.reduce((sum, item) => {
    return sum + item.quantite;
  }, 0);

  return totalItems;
};

export {
  getAllProducts,
  addToPanier,
  removeToPanier,
  viderPanier,
  passerCommande,
  allCommande,
  updateCommande,
  getContenuPanier,
  panierTemporaire,
  updatePanierQuantity,
  getTotalItems,
};
