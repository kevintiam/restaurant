import {
  isNomValid,
  isTelephoneValid,
  isEmailValid,
  isArticleValid,
  isIdValid,
  isAdresseValid,
  isValidPassword,
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
    return res.status(400).json({
      message: "Le nom complet (titulaire de carte) est invalide ou manquant.",
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
    return res.status(400).json({
      message:
        "L'ID du produit ou la quantité est manquant dans le corps de la requête.",
    });
  }

  if (!isArticleValid(id_produit, quantite)) {
    return res.status(400).json({
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

// validation des informations utilisateur lors de la création de compte
const validerInfosUtilisateur = (req, res, next) => {
  const { nom, prenom, mot_de_passe, courriel, id_type_utilisateur } = req.body;
  if (!nom || !prenom || !id_type_utilisateur || !courriel || !mot_de_passe) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }
  if (!isNomValid(nom)) {
    return res.status(400).json({ message: "Le nom est invalide." });
  }
  if (!isNomValid(prenom)) {
    return res.status(400).json({ message: "Le prénom est invalide." });
  }
  if (!isValidPassword(mot_de_passe)) {
    return res.status(400).json({ message: "Le mot de passe est invalide." });
  }
  if (!isEmailValid(courriel)) {
    return res
      .status(400)
      .json({ message: "L'adresse courriel est invalide." });
  }
  if(!isIdValid(id_type_utilisateur)) {
    return res.status(400).json({ message: "La catégorie d'utilisateur est invalide." });
  }
  next();
};

// validation pour la connexion utilisateur
const validerLogin = (req, res, next) => {
  const { courriel, mot_de_passe } = req.body;
  if (!courriel || !mot_de_passe) {
    return res
      .status(400)
      .json({ message: "L'email et le mot de passe sont requis." });
  }
  if (!isEmailValid(courriel)) {
    return res
      .status(400)
      .json({ message: "L'adresse courriel est invalide." });
  }
  next();
};

export {
  validerInfosClient,
  validerArticle,
  validerUpdate,
  validerID,
  validerInfosUtilisateur,
  validerLogin,
};
