import {
  isNomValid,
  isTelephoneValid,
  isEmailValid,
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

export { validerInfosClient};
