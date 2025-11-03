import { creerACount, loginUser } from "./api.js";
import {
  isEmailValid,
  isNomValid,
  isValidPassword,
  isIdValid,
} from "./validation.js";

const loginContainer = document.getElementById("login-container");

// Panneaux
const loginConnexion = document.querySelector(".login-connexion");
const registerConnexion = document.querySelector(".login-register");

// Formulaire de connexion
const formLogin = document.getElementById("login-form");
const errorLogin = document.getElementById("login-error-message");
const loginSubmitButton = formLogin.querySelector('button[type="submit"]');

// Formulaire de création de compte
const formRegister = document.getElementById("register-form");
const errorRegister = document.getElementById("register-error-message");
const registerSubmitButton = formRegister.querySelector(
  'button[type="submit"]'
);

// Éléments de bascule
const registerBascule = document.getElementById("register-bascule");
const loginBascule = document.getElementById("login-bascule");



// === Logique de formulaire ===
const login = async (e) => {
  e.preventDefault();
  const email = document.getElementById("user-login").value;
  const password = document.getElementById("passwd-login").value;

  if (!isEmailValid(email)) {
    showMessage(errorLogin, "Veuillez entrer une adresse e-mail valide.");
    return;
  }

  if (loginSubmitButton) loginSubmitButton.disabled = true;
  showMessage(errorLogin, "Connexion en cours...", false);

  try {
    const response = await loginUser(email, password);
    showMessage(errorLogin, "Connexion réussie! Redirection...", true);
    formLogin.reset();

    // Redirection après un court délai pour que l'utilisateur voie le message
    setTimeout(() => {
      window.location.href = response.redirectUrl || "/";
    }, 1000);
  } catch (error) {
    showMessage(errorLogin, error.message);
  } finally {
    if (loginSubmitButton) loginSubmitButton.disabled = false;
  }
};

const register = async (e) => {
  e.preventDefault();

  //Récupération des valeurs
  const name = document.getElementById("user-register").value;
  const prenom = document.getElementById("subname-register").value;
  const email = document.getElementById("email-register").value;
  const password = document.getElementById("passwd-register").value;
  const passwordConfirm = document.getElementById(
    "passwd-confirm-register"
  ).value;

  const categorie = document.getElementById("fruit-select").value;

  //Validation de base
  if (!isNomValid(name) || !isNomValid(prenom) || !isEmailValid(email)) {
    showMessage(errorRegister, "Veuillez vérifier le nom, prénom ou email.");
    return;
  }

  //Vérification des mots de passe correspondants
  if (password !== passwordConfirm) {
    showMessage(errorRegister, "Les mots de passe ne correspondent pas.");
    return;
  }

  // Validation de la force du mot de passe
  if (!isValidPassword(password)) {
    showMessage(
      errorRegister,
      "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
    );
    return;
  }

  // Vérification de la catégorie (ID valide couvre aussi le cas vide)
  if (!isIdValid(categorie)) {
    showMessage(errorRegister, "Veuillez sélectionner une catégorie valide.");
    return;
  }

  if (registerSubmitButton) registerSubmitButton.disabled = true;
  showMessage(errorRegister, "Création de compte en cours...", false);

  try {
    const user = await creerACount(name, prenom, password, categorie, email);
    showMessage(
      errorRegister,
      "Compte créé avec succès ! Vous pouvez vous connecter.",
      true
    );
    formRegister.reset();
    // Bascule vers le panneau de connexion après succès
    showLoginPanel();
  } catch (error) {
    showMessage(errorRegister, error.message);
  } finally {
    if (registerSubmitButton) registerSubmitButton.disabled = false;
  }
};

const showMessage = (error, message, isSuccess = false) => {
  if (!error) return;
  error.textContent = message;
  error.className = isSuccess ? "success-message" : "error-message";

  if (isSuccess) {
    setTimeout(() => {
      if (error.textContent === message) {
        error.textContent = "";
        error.className = "";
      }
    }, 5000);
  }
};

// === NOUVELLE Logique de basculement de panneau ===
const updateContainerHeight = (activePanel) => {
  if (loginContainer && activePanel) {
    // Ajoute un léger délai pour synchroniser avec l'animation du panneau
    requestAnimationFrame(() => {
      const newHeight = activePanel.offsetHeight;
      loginContainer.style.height = `${newHeight}px`;
    });
  }
};

const showLoginPanel = (e) => {
  if (e) e.preventDefault();
  if (!loginConnexion || !registerConnexion) return;

  loginConnexion.classList.remove("panel-hidden-left");

  registerConnexion.classList.remove("panel-active");
  registerConnexion.classList.add("panel-hidden-right");

  // Étape 3: Fait entrer le panneau de connexion (légèrement retardé pour un effet cascade)
  setTimeout(() => {
    loginConnexion.classList.add("panel-active");
    updateContainerHeight(loginConnexion);
  }, 50);

  // Réinitialise les messages d'erreur
  if (errorLogin) errorLogin.textContent = "";
  if (errorRegister) errorRegister.textContent = "";
};

/**
 * Affiche le panneau d'inscription avec animations fluides
 */
const showRegisterPanel = (e) => {
  if (e) e.preventDefault();
  if (!loginConnexion || !registerConnexion) return;

  // Étape 1: Prépare le panneau d'inscription pour l'entrée
  registerConnexion.classList.remove("panel-hidden-right");

  // Étape 2: Fait sortir le panneau de connexion
  loginConnexion.classList.remove("panel-active");
  loginConnexion.classList.add("panel-hidden-left");

  // Étape 3: Fait entrer le panneau d'inscription (légèrement retardé pour un effet cascade)
  setTimeout(() => {
    registerConnexion.classList.add("panel-active");
    updateContainerHeight(registerConnexion);
  }, 50);

  // Réinitialise les messages d'erreur
  if (errorLogin) errorLogin.textContent = "";
  if (errorRegister) errorRegister.textContent = "";
};

/**
 * Attache les écouteurs d'événements aux boutons de bascule
 */
const bascule = () => {
  if (registerBascule) {
    registerBascule.addEventListener("click", showRegisterPanel);
  }
  if (loginBascule) {
    loginBascule.addEventListener("click", showLoginPanel);
  }
};

const visiblePassword = (toggleButton, passwordInput) => {
  if (!toggleButton || !passwordInput) return;
  
  // Éviter les event listeners en double
  if (toggleButton.dataset.initialized === "true") return;
  
  let isVisible = false;
  const eyeIcon = toggleButton.querySelector("i");

  toggleButton.addEventListener("click", () => {
    isVisible = !isVisible;
    passwordInput.type = isVisible ? "text" : "password";
    if (eyeIcon) {
      eyeIcon.classList.toggle("fa-eye", !isVisible);
      eyeIcon.classList.toggle("fa-eye-slash", isVisible);
    }
    passwordInput.focus();
  });

  toggleButton.dataset.initialized = "true";
};
/**
 * Initialisation au chargement de la page
 */
document.addEventListener("DOMContentLoaded", async () => {
  if (formLogin) {
    formLogin.addEventListener("submit", login);
  }
  if (formRegister) {
    formRegister.addEventListener("submit", register);
  }

  // Initialiser les boutons de visibilité des mots de passe
  const toggleLoginPassword = document.getElementById("toggle-password-login");
  const loginPasswordInput = document.getElementById("passwd-login");
  visiblePassword(toggleLoginPassword, loginPasswordInput);

  const toggleRegisterPassword = document.getElementById("toggle-password-register");
  const registerPasswordInput = document.getElementById("passwd-register");
  visiblePassword(toggleRegisterPassword, registerPasswordInput);

  const toggleConfirmPassword = document.getElementById("toggle-password-confirm");
  const confirmPasswordInput = document.getElementById("passwd-confirm-register");
  visiblePassword(toggleConfirmPassword, confirmPasswordInput);

  bascule();

  // --- Initialisation de l'état avec transition d'entrée ---
  // Par défaut, affiche le panneau d'inscription
  if (loginConnexion && registerConnexion) {
    // Cache le panneau de connexion
    loginConnexion.classList.add("panel-hidden-left");

    registerConnexion.classList.remove("panel-hidden-right");

    setTimeout(() => {
      registerConnexion.classList.add("panel-active");

      // Définit la hauteur initiale après que le contenu soit rendu
      requestAnimationFrame(() => {
        if (loginContainer) {
          loginContainer.style.height = `${registerConnexion.offsetHeight}px`;
        }
      });
    }, 100);
  }

  // Met à jour la hauteur si la fenêtre est redimensionnée
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const activePanel = document.querySelector(".panel-active");
      if (activePanel) {
        updateContainerHeight(activePanel);
      }
    }, 150); // Debounce pour améliorer les performances
  });
});
