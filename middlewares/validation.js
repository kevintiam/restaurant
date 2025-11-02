import {
  isNomValid,
  isTelephoneValid,
  isEmailValid,
  isArticleValid,
  isIdValid,
  isAdresseValid,
} from "../public/js/validation.js";

// --- 1. Validation des informations client (Adresse, Nom, Téléphone, Courriel) ---
const validerInfosClient = (req, res, next) => {
  const { adresse_livraison, nom_complet, telephone, courriel } = req.body;

  if (!isAdresseValid(adresse_livraison)) {
    return res
      .status(400)
      .json({ message: " L'adresse de livraison est invalide." });
  }

  if (!isNomValid(nom_complet)) {
    return res
      .status(400)
      .json({
        message:
          "Le nom complet (titulaire de carte) est invalide ou manquant.",
      });
  }

  if (!isTelephoneValid(telephone)) {
    return res
      .status(400)
      .json({ message: "Le numéro de téléphone est invalide." });
  }

  if (!isEmailValid(courriel)) {
    return res
      .status(400)
      .json({ message: "L'adresse courriel est invalide." });
  }

  next();
};

// --- 2. Validation d'un article unique 
const validerArticle = (req, res, next) => {
  const { id_produit, quantite } = req.body;

  if (id_produit === undefined || quantite === undefined) {
    return res
      .status(400)
      .json({
        message:
          "L'ID du produit ou la quantité est manquant dans le corps de la requête.",
      });
  }

  if (!isArticleValid(id_produit, quantite)) {
    return res
      .status(400)
      .json({
        message:
          "L'ID du produit ou la quantité n'est pas dans un format valide (entier positif, max 99).",
      });
  }

  next();
};

// --- 3. Validation de mise à jour 
const validerUpdate = (req, res, next) => {
  const id = req.params.id;
  const { quantite } = req.body; 
  if (id === undefined) {
    return res.status(400).json({
      message:
        "L'identifiant du produit (ID) est manquant dans l'adresse (URL).",
    });
  } 
  if (quantite === undefined) {
    return res.status(400).json({
      message: "La quantité est manquante dans le corps de la requête.",
    });
  } 
  if (!isArticleValid(id, quantite)) {
    return res.status(400).json({
      message:
        "L'ID ou la quantité n'est pas valide (vérifiez le format ou les limites).",
    });
  }

  next();
};

// --- 4. Validation d'un ID de paramètre 
const validerID = (req, res, next) => {
  const id = req.params.id;
  if (id === undefined) {
    return res.status(400).json({
      message: "L'identifiant du produit est manquant dans l'adresse (URL).",
    });
  }
  if (!isIdValid(id)) {
    return res.status(400).json({
      message:
        "L'identifiant du produit est dans un format invalide (doit être un entier positif).",
    });
  }
  next();
};

const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Non autorisé" });
  }
  req.user = { id: req.session.userId };
  next();
};
export { requireAuth ,validerInfosClient, validerArticle, validerUpdate, validerID };
