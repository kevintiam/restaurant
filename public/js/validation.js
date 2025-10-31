// validation du nom et prenom
const isNomValid = (nom, minLength = 2, maxLength = 50) => {
  if (typeof nom !== "string") return false;

  const trimmedNom = nom.trim();
  return (
    trimmedNom.length >= minLength &&
    trimmedNom.length <= maxLength &&
    /^[a-zA-ZÀ-ÿ\s\-']+$/.test(trimmedNom)
  ); // Accepte les caractères accentués
};
// validation du numero de telephone
const isTelephoneValid = (telephone) => {
  if (typeof telephone !== "string") return false;

  const cleanedTelephone = telephone.trim().replace(/\s+/g, "");

  // Formats supportés :
  // - International: +33 1 23 45 67 89, +1-800-123-4567
  // - National: 01 23 45 67 89, (012) 345-6789
  // - Standard: 0123456789
  const phoneRegex =
    /^(?:\+?\d{1,4}[\s\-]?)?(?:\(?\d{1,}\)?[\s\-]?)?\d{1,}[\s\-]?\d{1,}[\s\-]?\d{1,}$/;

  return (
    cleanedTelephone.length >= 8 &&
    cleanedTelephone.length <= 15 &&
    phoneRegex.test(cleanedTelephone)
  );
};

// validation des adresses
const isAdresseValid = (adresse) => {
    if (typeof adresse !== "string") return false;

    const trimmedAdresse = adresse.trim(); 

    // Vérification de la présence de chiffres (pour le numéro civique)
    const containsNumber = /\d/.test(trimmedAdresse);
    
    // Vérification de la présence de lettres (pour le nom de la rue)
    const containsLetter = /[a-zA-ZÀ-ÿ]/.test(trimmedAdresse); 

    return containsNumber && containsLetter;
};
// validation de l'email (Version Corrigée et Robuste)
const isEmailValid = (email) => {
  if (typeof email !== "string") return false;

  const trimmedEmail = email.trim();

  // Vérification basique avant le regex lourd
  if (
    trimmedEmail.length === 0 ||
    trimmedEmail.length > 254 ||
    !trimmedEmail.includes("@")
  ) {
    return false;
  }

  // Regex email robuste
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  return emailRegex.test(trimmedEmail);
};
// fonction pour verifier le numero de la carte
const isNumeroCarteValid = (numeroCarte) => {
  if (typeof numeroCarte !== "string") return false;

  // Nettoyer le numéro (supprimer les espaces et tirets)
  const cleanedNumero = numeroCarte.replace(/[\s\-]/g, "");

  // Vérifier la longueur (généralement 13-19 chiffres)
  if (!/^\d{13,19}$/.test(cleanedNumero)) {
    return false;
  }

  // Algorithme de Luhn
  let sum = 0;
  let isEven = false;

  for (let i = cleanedNumero.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanedNumero[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};
// fonction pour avoir le type de carte
const getTypeCarte = (numeroCarte) => {
  const cleanedNumero = numeroCarte.replace(/[\s\-]/g, "");

  const typesCarte = [
    {
      type: "visa",
      pattern: /^4/,
      lengths: [13, 16, 19],
    },
    {
      type: "mastercard",
      pattern: /^(5[1-5]|2[2-7])/,
      lengths: [16],
    },
    {
      type: "amex",
      pattern: /^3[47]/,
      lengths: [15],
    },
    {
      type: "discover",
      pattern: /^6(?:011|5)/,
      lengths: [16],
    },
    {
      type: "diners",
      pattern: /^3(?:0[0-5]|[68])/,
      lengths: [14],
    },
    {
      type: "jcb",
      pattern: /^35/,
      lengths: [16],
    },
  ];

  const typeTrouve = typesCarte.find(
    (type) =>
      type.pattern.test(cleanedNumero) &&
      type.lengths.includes(cleanedNumero.length)
  );

  return typeTrouve ? typeTrouve.type : "unknown";
};
// Validation de la date d'expiration
const isDateExpirationValid = (dateExpiration) => {
  if (typeof dateExpiration !== "string") return false;

  const cleanedDate = dateExpiration.trim();

  // Formats acceptés: MM/YY, MM/YYYY, MM-YY, MM-YYYY
  const dateRegex = /^(0[1-9]|1[0-2])[/-](\d{2}|\d{4})$/;
  if (!dateRegex.test(cleanedDate)) {
    return false;
  }

  const [mois, annee] = cleanedDate.split(/[/-]/);
  const moisInt = parseInt(mois, 10);
  let anneeInt = parseInt(annee, 10);

  // Convertir l'année en 4 chiffres si nécessaire
  if (anneeInt < 100) {
    anneeInt += 2000; // Suppose que les années 00-99 sont 2000-2099
  }

  const dateActuelle = new Date();
  const anneeActuelle = dateActuelle.getFullYear();
  const moisActuel = dateActuelle.getMonth() + 1; // Les mois vont de 0 à 11

  // Vérifier si la carte est expirée
  if (anneeInt < anneeActuelle) {
    return false;
  }

  if (anneeInt === anneeActuelle && moisInt < moisActuel) {
    return false;
  }

  // Vérifier si la date n'est pas trop éloignée (max 15 ans)
  if (anneeInt > anneeActuelle + 15) {
    return false;
  }

  return true;
};
// Validation du code CVV
const isCVVValid = (cvv, numeroCarte = "") => {
  if (typeof cvv !== "string") return false;

  const cleanedCVV = cvv.trim();

  // Vérifier que c'est un nombre
  if (!/^\d+$/.test(cleanedCVV)) {
    return false;
  }

  // Déterminer la longueur attendue basée sur le type de carte
  let longueurAttendue = 3; // Par défaut

  if (numeroCarte) {
    const typeCarte = getTypeCarte(numeroCarte);
    if (typeCarte === "amex") {
      longueurAttendue = 4;
    }
  }

  return cleanedCVV.length === longueurAttendue;
};
// Validation du code postal
const isCodePostalValid = (codePostal) => {
  if (typeof codePostal !== "string") return false;

  const cleanedCode = codePostal.trim().toUpperCase();

  // Format canadien: A1A 1A1
  const regexCanadien = /^[A-Z]\d[A-Z] \d[A-Z]\d$/;

  // Format US: 12345 ou 12345-6789
  const regexUS = /^\d{5}(-\d{4})?$/;

  return regexCanadien.test(cleanedCode) || regexUS.test(cleanedCode);
};
// Validation complète des informations de carte
const isCarteCreditValid = (carteInfo) => {
  const { numeroCarte, dateExpiration, cvv, titulaire, codePostal } = carteInfo;

  // Vérifier que tous les champs sont présents
  if (!numeroCarte || !dateExpiration || !cvv || !titulaire || !codePostal) {
    return {
      isValid: false,
      erreur: "Tous les champs sont obligatoires",
    };
  }

  // Valider le numéro de carte
  if (!isNumeroCarteValid(numeroCarte)) {
    return {
      isValid: false,
      erreur: "Numéro de carte invalide",
    };
  }

  // Valider la date d'expiration
  if (!isDateExpirationValid(dateExpiration)) {
    return {
      isValid: false,
      erreur: "Date d'expiration invalide ou carte expirée",
    };
  }

  // Valider le CVV
  if (!isCVVValid(cvv, numeroCarte)) {
    const typeCarte = getTypeCarte(numeroCarte);
    const longueurAttendue = typeCarte === "amex" ? 4 : 3;
    return {
      isValid: false,
      erreur: `Code CVV invalide (${longueurAttendue} chiffres requis)`,
    };
  }

  // Valider le nom du titulaire
  if (!isNomValid(titulaire)) {
    return {
      isValid: false,
      erreur: "Nom du titulaire invalide",
    };
  }

  // Valider le code postal
  if (!isCodePostalValid(codePostal)) {
    return {
      isValid: false,
      erreur: "Code postal invalide",
    };
  }

  return {
    isValid: true,
    typeCarte: getTypeCarte(numeroCarte),
    erreur: null,
  };
};
// formater le numero de Carte
const formaterNumeroCarte = (numeroCarte) => {
  const cleaned = numeroCarte.replace(/[\s\-]/g, "");
  const typeCarte = getTypeCarte(cleaned);

  switch (typeCarte) {
    case "amex":
      return cleaned.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3");
    case "diners":
      return cleaned.replace(/(\d{4})(\d{6})(\d{4})/, "$1 $2 $3");
    default:
      return cleaned.replace(/(\d{4})/g, "$1 ").trim();
  }
};
// Fonction pour masquer le numéro de carte (sauf les 4 derniers chiffres)
const masquerNumeroCarte = (numeroCarte) => {
  const cleaned = numeroCarte.replace(/[\s\-]/g, "");
  const derniersChiffres = cleaned.slice(-4);
  return `•••• •••• •••• ${derniersChiffres}`;
};

/**
 * Vérifie si l'ID d'un produit et sa quantité sont valides.
 * * @param {number|string} id_produit - L'identifiant du produit.
 * @param {number|string} quantite - La quantité désirée.
 * @returns {boolean} Retourne true si les deux valeurs sont valides.
 */
const isArticleValid = (id_produit, quantite) => {
  // --- 1. Validation de l'ID du Produit ---

  // Convertit en nombre (pour gérer les IDs passés en chaîne de caractères)
  const id = Number(id_produit);

  if (!Number.isInteger(id) || id <= 0) {
    // console.error("ID produit invalide ou manquant.");
    return false;
  }

  // --- 2. Validation de la Quantité ---
  // Convertit en nombre (pour gérer les quantités passées en chaîne de caractères)
  const qty = Number(quantite);

  // Vérifie si la quantité est un nombre entier positif
  if (!Number.isInteger(qty) || qty <= 0) {
    // console.error("Quantité invalide ou non positive.");
    return false;
  }
  // --- 3. Validation Optionnelle (Limite Max) ---
  if (qty < 1 || qty > 100) {
    return false;
  }

  return true;
};

// Fonction pour vérifier si une valeur est un ID valide
const isIdValid = (id) => {
  const numId = Number(id);
  return Number.isInteger(numId) && numId > 0;
};

const isValidQuantity = (quantite) => {
  const numId = Number(quantite);
  return (
    Number.isInteger(numId) && 
    numId >= 1 && 
    numId < 100);
};

export {
  isNomValid,
  isTelephoneValid,
  isEmailValid,
  isNumeroCarteValid,
  isDateExpirationValid,
  isCVVValid,
  isCodePostalValid,
  isCarteCreditValid,
  getTypeCarte,
  formaterNumeroCarte,
  masquerNumeroCarte,
  isArticleValid,
  isIdValid,
  isValidQuantity,
  isAdresseValid,
};
