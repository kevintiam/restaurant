/**
 * Tests unitaires pour les fonctions de validation
 * Ces tests vérifient que les validations côté client/serveur fonctionnent correctement
 */

import {
  isEmailValid,
  isNomValid,
  isValidPassword,
  isTelephoneValid,
  isAdresseValid,
  isArticleValid,
  isIdValid,
  isValidQuantity,
} from '../public/js/validation.js';

describe('Validation des emails', () => {
  test('devrait accepter un email valide', () => {
    expect(isEmailValid('test@example.com')).toBe(true);
    expect(isEmailValid('user.name@domain.co.uk')).toBe(true);
    expect(isEmailValid('user+tag@example.com')).toBe(true);
  });

  test('devrait rejeter un email invalide', () => {
    expect(isEmailValid('invalid')).toBe(false);
    expect(isEmailValid('test@')).toBe(false);
    expect(isEmailValid('@domain.com')).toBe(false);
    expect(isEmailValid('test @example.com')).toBe(false);
    expect(isEmailValid('')).toBe(false);
  });

  test('devrait gérer les types incorrects', () => {
    expect(isEmailValid(123)).toBe(false);
    expect(isEmailValid(null)).toBe(false);
    expect(isEmailValid(undefined)).toBe(false);
  });
});

describe('Validation des noms et prénoms', () => {
  test('devrait accepter un nom valide', () => {
    expect(isNomValid('Kevin')).toBe(true);
    expect(isNomValid('Jean-Pierre')).toBe(true);
    expect(isNomValid("O'Connor")).toBe(true);
    expect(isNomValid('José')).toBe(true);
    expect(isNomValid('Marie Françoise')).toBe(true);
  });

  test('devrait rejeter un nom invalide', () => {
    expect(isNomValid('A')).toBe(false); // Trop court (< 2 caractères)
    expect(isNomValid('')).toBe(false);
    expect(isNomValid('   ')).toBe(false);
    expect(isNomValid('123')).toBe(false); // Chiffres
    expect(isNomValid('Test@123')).toBe(false); // Caractères spéciaux
  });

  test('devrait respecter les limites de longueur', () => {
    expect(isNomValid('A'.repeat(50))).toBe(true); // Max 50
    expect(isNomValid('A'.repeat(51))).toBe(false); // Trop long
  });
});

describe('Validation des mots de passe', () => {
  test('devrait accepter un mot de passe valide', () => {
    expect(isValidPassword('Password123!')).toBe(true);
    expect(isValidPassword('Secure@Pass2024')).toBe(true);
    expect(isValidPassword('MyP@ssw0rd')).toBe(true);
  });

  test('devrait rejeter un mot de passe trop court', () => {
    expect(isValidPassword('Pass1!')).toBe(false); // < 8 caractères
  });

  test('devrait exiger au moins une majuscule', () => {
    expect(isValidPassword('password123!')).toBe(false);
  });

  test('devrait exiger au moins une minuscule', () => {
    expect(isValidPassword('PASSWORD123!')).toBe(false);
  });

  test('devrait exiger au moins un chiffre', () => {
    expect(isValidPassword('Password!')).toBe(false);
  });

  test('devrait exiger au moins un caractère spécial', () => {
    expect(isValidPassword('Password123')).toBe(false);
  });

  test('devrait gérer les types incorrects', () => {
    expect(isValidPassword(123)).toBe(false);
    expect(isValidPassword(null)).toBe(false);
  });
});

describe('Validation des numéros de téléphone', () => {
  test('devrait accepter un numéro valide', () => {
    expect(isTelephoneValid('0123456789')).toBe(true);
    expect(isTelephoneValid('+33 1 23 45 67 89')).toBe(true);
    expect(isTelephoneValid('+1-800-123-4567')).toBe(true);
    expect(isTelephoneValid('(012) 345-6789')).toBe(true);
  });

  test('devrait rejeter un numéro trop court', () => {
    expect(isTelephoneValid('123')).toBe(false);
    expect(isTelephoneValid('1234567')).toBe(false);
  });

  test('devrait rejeter un numéro trop long', () => {
    expect(isTelephoneValid('1234567890123456')).toBe(false);
  });

  test('devrait gérer les types incorrects', () => {
    expect(isTelephoneValid(123456789)).toBe(false);
    expect(isTelephoneValid(null)).toBe(false);
  });
});

describe('Validation des adresses', () => {
  test('devrait accepter une adresse valide', () => {
    expect(isAdresseValid('123 Rue de la Paix')).toBe(true);
    expect(isAdresseValid('45 Avenue des Champs-Élysées')).toBe(true);
    expect(isAdresseValid('1 Place de la République')).toBe(true);
  });

  test('devrait rejeter une adresse sans numéro', () => {
    expect(isAdresseValid('Rue de la Paix')).toBe(false);
  });

  test('devrait rejeter une adresse sans nom de rue', () => {
    expect(isAdresseValid('123')).toBe(false);
  });

  test('devrait gérer les types incorrects', () => {
    expect(isAdresseValid(123)).toBe(false);
    expect(isAdresseValid(null)).toBe(false);
  });
});

describe('Validation des articles (ID + Quantité)', () => {
  test('devrait accepter un article valide', () => {
    expect(isArticleValid(1, 5)).toBe(true);
    expect(isArticleValid('10', '20')).toBe(true); // Chaînes converties
    expect(isArticleValid(5, 1)).toBe(true); // Min 1
    expect(isArticleValid(5, 100)).toBe(true); // Max 100
  });

  test('devrait rejeter un ID invalide', () => {
    expect(isArticleValid(0, 5)).toBe(false); // ID = 0
    expect(isArticleValid(-1, 5)).toBe(false); // ID négatif
    expect(isArticleValid('abc', 5)).toBe(false); // Non numérique
  });

  test('devrait rejeter une quantité invalide', () => {
    expect(isArticleValid(5, 0)).toBe(false); // Quantité = 0
    expect(isArticleValid(5, -1)).toBe(false); // Quantité négative
    expect(isArticleValid(5, 101)).toBe(false); // > Max
    expect(isArticleValid(5, 'abc')).toBe(false); // Non numérique
  });
});

describe('Validation des IDs', () => {
  test('devrait accepter un ID valide', () => {
    expect(isIdValid(1)).toBe(true);
    expect(isIdValid('5')).toBe(true);
    expect(isIdValid(999)).toBe(true);
  });

  test('devrait rejeter un ID invalide', () => {
    expect(isIdValid(0)).toBe(false);
    expect(isIdValid(-1)).toBe(false);
    expect(isIdValid('abc')).toBe(false);
    expect(isIdValid(1.5)).toBe(false); // Pas un entier
  });
});

describe('Validation des quantités', () => {
  test('devrait accepter une quantité valide', () => {
    expect(isValidQuantity(1)).toBe(true);
    expect(isValidQuantity('50')).toBe(true);
    expect(isValidQuantity(99)).toBe(true);
  });

  test('devrait rejeter une quantité invalide', () => {
    expect(isValidQuantity(0)).toBe(false); // Min = 1
    expect(isValidQuantity(100)).toBe(false); // Max = 99
    expect(isValidQuantity(-5)).toBe(false);
    expect(isValidQuantity(1.5)).toBe(false); // Pas un entier
  });
});
