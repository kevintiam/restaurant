import {
  isNomValid,
  isTelephoneValid,
  isEmailValid,
  isArticleValid,
  isIdValid,
} from "../public/js/validation";

const validerInfosClient = (req, res, next) => {
  const { adresse_livraison, nom_complet, telephone, courriel } = req.body; // Si un des champs est INVALIDE, on entre dans la condition
  if (
    !isNomValid(adresse_livraison) ||
    !isNomValid(nom_complet) ||
    !isTelephoneValid(telephone) ||
    !isEmailValid(courriel)
  ) {
    // CORRECTION : 'return' stoppe l'exécution ici et empêche 'next()' d'être appelé.
    return res.status(400).end();
  } // Si la validation réussit, on passe au middleware/contrôleur suivant
  next();
};

const validerArticle = (req, res, next) => {
  const { id_produit, quantite } = req.body;
  if (
    id_produit === undefined ||
    quantite === undefined ||
    !isArticleValid(id_produit, quantite)
  ) {
    return res.status(400).end();
  }
  next();
};

const validerUpdate = (req, res, next) => {
  const id = req.params.id;
  const { quantite } = req.body;

  // --- 1. Vérification de la présence de l'ID ---
  if (id === undefined) {
    return res
      .status(400)
      .json({
        message:
          "L'identifiant du produit (ID) est manquant dans l'adresse (URL).",
      });
  }

  // --- 2. Vérification de la présence de la Quantité ---
  if (quantite === undefined) {
    // C'est ici que votre message original est pertinent
    return res
      .status(400)
      .json({
        message:
          "La quantité (quantite) est manquante dans le corps de la requête.",
      });
  }

  // --- 3. Vérification de la validité ---
  // On vérifie maintenant le format et la valeur de l'ID et de la quantité.
  if (!isArticleValid(id, quantite)) {
    return res.status(400).json({
      message:
        "La validation des données a échoué.",
    });
  }

  next();
};


const validerID = (req, res, next) => {
    const id = req.params.id; 

    if (id === undefined || !isIdValid(id)) {
        return res.status(400).json({ 
            message: "Validation échouée : L'identifiant du produit est manquant ou invalide." 
        });
    }
    next();
};
export { validerInfosClient, validerArticle, validerUpdate,validerID };
