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
    return "Le panier est déjà vide.";
  }
  panierTemporaire.length = 0;
  return "Panier vidé avec succès.";
};

// fonction pour passer la commande (creer la commande)
const passerCommande = async (
  adresse_livraison,
  nom_complet,
  telephone,
  courriel
) => {
  if (!adresse_livraison || !nom_complet || !telephone) {
    throw new Error(
      "Les informations de contact (Nom, Tél, Adresse) sont incomplètes."
    );
  }
  if (panierTemporaire.length === 0) {
    throw new Error("Impossible de soumettre : le panier est vide.");
  }

  const adresseComplete = [
    `CLIENT: ${nom_complet}`,
    `TÉL: ${telephone}`,
    `COURRIEL: ${courriel}`,
    `ADRESSE: ${adresse_livraison}`,
  ]
    .filter(Boolean)
    .join(" | ");

  try {
    const nouvelleCommande = await prisma.$transaction(async (tx) => {
      //Création de l'ID formaté (CM-timestamp)
      const uniqueSuffix = Date.now();
      const formattedId = `CM-${uniqueSuffix}`;
      const commande = await tx.commande.create({
        data: {
          id_utilisateur: 1,
          reference_commande: formattedId,
          id_etat_commande: 1,
          date: new Date(),
          adresse_livraison: adresseComplete,
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

    return commandes.map((commande) => {
      const total = commande.CommandeProduit.reduce((sum, item) => {
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

const calculateOrderTotals = async (itemsPourRecu, TAXE, TRANSPORT_RATE) => {
  const sousTotal = itemsPourRecu.reduce((somme, item) => {
    const itemPrice = item.quantite * item.prix;
    return somme + itemPrice;
  }, 0);

  const transport = sousTotal * TRANSPORT_RATE;
  const taxe = sousTotal * TAXE;
  const totalFinal = sousTotal + taxe + transport;

  return {
    sousTotal: sousTotal.toFixed(2),
    taxe: taxe.toFixed(2),
    transport: transport.toFixed(2),
    totalFinal: totalFinal.toFixed(2),
  };
};

const getTypeUser = async () => {
  return await prisma.typeUtilisateur.findMany();
};

const addUser = async (name, subname, passwd, categorie, email) => {
  if (!name || !subname || !passwd || !categorie || !email) {
    throw new Error("Tous les champs sont obligatoires");
  }
  const hashedPassword = await bcrypt.hash(passwd, 10);
  try {
    const newUser = await prisma.utilisateur.create({
      data: {
        courriel: email,
        nom: name,
        prenom: subname,
        mot_de_passe: hashedPassword,
        id_type_utilisateur: categorie,
      },
    });
    return newUser;
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("Cet email est déjà utilisé.");
    }
    throw new Error("Erreur lors de la création de l’utilisateur.");
  }
};

const validationPasswd = (password) => {
  if (password.length < 8 || password.length > 128) {
    return "Le mot de passe doit contenir entre 8 et 128 caractères.";
  }

  if (!/[a-z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une lettre minuscule.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Le mot de passe doit contenir au moins une lettre majuscule.";
  }

  if (!/\d/.test(password)) {
    return "Le mot de passe doit contenir au moins un chiffre.";
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    return "Le mot de passe doit contenir au moins un caractère spécial.";
  }

  return null;
};

const connexionUser = async (email) => {
  if (!email) {
    return null;
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        courriel: email.toLowerCase().trim(),
      },
    });
    return user;
  } catch (error) {
    throw new Error("Erreur lors de la récupération de l'utilisateur");
  }
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
  calculateOrderTotals,
  getTypeUser,
  addUser,
  validationPasswd,
  connexionUser,
};
