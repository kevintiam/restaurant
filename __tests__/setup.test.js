/**
 * 🧪 Test simple pour vérifier que Jest fonctionne
 * Lancez: npm test
 */

describe('Configuration Jest', () => {
  test('Jest fonctionne correctement', () => {
    expect(true).toBe(true);
  });

  test('les additions fonctionnent', () => {
    expect(2 + 2).toBe(4);
  });

  test('les chaînes fonctionnent', () => {
    const message = 'Hello';
    expect(message).toBe('Hello');
    expect(message).toContain('ell');
  });

  test('les tableaux fonctionnent', () => {
    const fruits = ['pomme', 'banane', 'orange'];
    expect(fruits).toHaveLength(3);
    expect(fruits).toContain('banane');
  });

  test('les objets fonctionnent', () => {
    const user = {
      nom: 'Kevin',
      email: 'kevin@example.com',
    };
    expect(user).toHaveProperty('nom');
    expect(user.email).toBe('kevin@example.com');
  });
});
