# 🧪 Guide des Tests Unitaires

## 📦 Installation

```bash
npm install --save-dev jest supertest @types/jest
```

## 🚀 Lancer les tests

### Tous les tests
```bash
npm test
```

### Tests en mode watch (re-exécute à chaque changement)
```bash
npm run test:watch
```

### Tests avec rapport de couverture
```bash
npm run test:coverage
```

### Tests de validation uniquement
```bash
npm run test:validation
```

## 📁 Structure des tests

```
__tests__/
├── validation.test.js    # ✅ Tests des fonctions de validation
├── model.test.js         # 🔨 Tests des fonctions métier (à compléter)
└── routes.test.js        # 🛣️ Tests des routes API (à compléter)
```

## ✅ Tests déjà implémentés (validation.test.js)

### Validation des emails
- ✅ Accepte les emails valides
- ✅ Rejette les emails invalides
- ✅ Gère les types incorrects

### Validation des noms/prénoms
- ✅ Accepte les noms avec accents, tirets, apostrophes
- ✅ Rejette les noms trop courts (< 2 caractères)
- ✅ Rejette les noms avec chiffres
- ✅ Respecte les limites de longueur (2-50 caractères)

### Validation des mots de passe
- ✅ Exige au moins 8 caractères
- ✅ Exige 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
- ✅ Rejette les mots de passe trop simples

### Validation des téléphones
- ✅ Accepte différents formats (local, international)
- ✅ Vérifie la longueur (8-15 chiffres)

### Validation des adresses
- ✅ Exige un numéro ET un nom de rue
- ✅ Rejette les adresses incomplètes

### Validation des articles (panier)
- ✅ Vérifie l'ID du produit (> 0)
- ✅ Vérifie la quantité (1-100)

## 🔨 Comment écrire un nouveau test

### Exemple basique

```javascript
import { maFonction } from '../chemin/vers/module.js';

describe('Nom du groupe de tests', () => {
  test('devrait faire quelque chose', () => {
    const resultat = maFonction(param);
    expect(resultat).toBe(valeurAttendue);
  });
});
```

### Exemple avec async/await

```javascript
test('devrait créer un utilisateur', async () => {
  const user = await addUser('Kevin', 'Tiam', 'password', 1, 'test@example.com');
  expect(user).toHaveProperty('id_utilisateur');
  expect(user.courriel).toBe('test@example.com');
});
```

### Tester les erreurs

```javascript
test('devrait lever une erreur', () => {
  expect(() => {
    maFonction(paramInvalide);
  }).toThrow('Message d\'erreur attendu');
});

// Avec async
test('devrait rejeter une promesse', async () => {
  await expect(maFonctionAsync()).rejects.toThrow('Erreur');
});
```

## 🎯 Matchers Jest courants

```javascript
// Égalité
expect(value).toBe(expected);           // Égalité stricte (===)
expect(value).toEqual(expected);        // Égalité profonde (objets)
expect(value).not.toBe(expected);       // Négation

// Booléens
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// Nombres
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(5);
expect(value).toBeCloseTo(0.3);         // Nombres flottants

// Chaînes
expect(string).toMatch(/pattern/);
expect(string).toContain('substring');

// Tableaux
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objets
expect(obj).toHaveProperty('key');
expect(obj).toHaveProperty('key', value);

// Erreurs
expect(fn).toThrow();
expect(fn).toThrow('Error message');
```

## 🔧 Mock et Spy

### Mocker une fonction

```javascript
const mockFn = jest.fn();
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue('async value');

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
```

### Mocker un module

```javascript
jest.mock('../model/restaurant.js', () => ({
  getAllProducts: jest.fn().mockResolvedValue([
    { id: 1, nom: 'Produit Test' }
  ])
}));
```

## 📊 Rapport de couverture

Après `npm run test:coverage`, consultez `coverage/lcov-report/index.html` dans votre navigateur.

### Objectifs de couverture recommandés
- 🎯 **Validation**: 100% (critique pour la sécurité)
- 🎯 **Model**: 80%+ (logique métier importante)
- 🎯 **Routes**: 70%+ (beaucoup de dépendances externes)

## 🐛 Debugging des tests

### Afficher des logs pendant les tests
```javascript
test('debug example', () => {
  console.log('Valeur:', maVariable);
  // Les logs s'affichent dans la console
});
```

### Lancer un seul test
```javascript
test.only('ce test uniquement', () => {
  // ...
});
```

### Ignorer un test temporairement
```javascript
test.skip('test ignoré', () => {
  // ...
});
```

## 📝 Bonnes pratiques

1. **Un test = une fonctionnalité**
   - Testez une seule chose à la fois
   - Nom de test descriptif

2. **Arrange, Act, Assert (AAA)**
   ```javascript
   test('exemple AAA', () => {
     // Arrange: Préparer les données
     const input = 'test@example.com';
     
     // Act: Exécuter la fonction
     const result = isEmailValid(input);
     
     // Assert: Vérifier le résultat
     expect(result).toBe(true);
   });
   ```

3. **Tests indépendants**
   - Chaque test doit pouvoir s'exécuter seul
   - Utilisez `beforeEach` pour réinitialiser

4. **Tester les cas limites**
   - Valeurs nulles, undefined
   - Chaînes vides
   - Nombres négatifs
   - Limites min/max

5. **Noms de tests clairs**
   ```javascript
   // ❌ Mauvais
   test('test email', () => {...});
   
   // ✅ Bon
   test('devrait accepter un email valide avec un domaine .co.uk', () => {...});
   ```

## 🚀 Prochaines étapes

1. **Compléter model.test.js**
   - Implémenter les tests des fonctions panier
   - Tester les fonctions de commande
   - Mocker Prisma pour isoler les tests

2. **Compléter routes.test.js**
   - Tester les routes avec Supertest
   - Tester l'authentification
   - Tester les middlewares

3. **Ajouter des tests E2E**
   - Installer Playwright ou Cypress
   - Tester le parcours utilisateur complet

4. **CI/CD**
   - Exécuter les tests automatiquement sur GitHub Actions
   - Bloquer les merge si les tests échouent

## 📚 Ressources

- [Documentation Jest](https://jestjs.io/docs/getting-started)
- [Supertest GitHub](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
