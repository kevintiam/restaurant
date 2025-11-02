import { creerACount, loginUser } from "./api.js";
import { isEmailValid, isNomValid } from "./validation.js";

// Formulaire de connexion
const formLogin = document.getElementById("login-form");
const errorLogin = document.getElementById("login-error-message");
const loginConnexion = document.querySelector(".login-connexion");
const loginSubmitButton = formLogin.querySelector('button[type="submit"]');

// Création d'un compte
const formRegister = document.getElementById("register-form");
const errorRegister = document.getElementById("register-error-message");
const registerConnexion = document.querySelector(".login-register");
const registerSubmitButton = formRegister.querySelector(
  'button[type="submit"]'
);

// Éléments de bascule
const registerBascule = document.getElementById("register-bascule");
const loginBascule = document.getElementById("login-bascule");

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
    const user = await loginUser(email, password);
    showMessage(errorLogin, "Connexion reussie!.", true);

    formLogin.reset();
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
  const categorie = document.getElementById("categorie-select").value;

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
  const passwordError = validationPasswd(password);
  if (passwordError) {
    showMessage(errorRegister, passwordError);
    return;
  }

  // Vérification de la catégorie (si le champ est requis)
  if (!categorie) {
    showMessage(errorRegister, "Veuillez sélectionner une catégorie.");
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
    showLoginPanel();
  } catch (error) {
    showMessage(errorRegister, error.message);
  } finally {
    if (registerSubmitButton) registerSubmitButton.disabled = false;
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

// fonction pour afficher la page de connexion
const showLoginPanel = (e) => {
  e.preventDefault();
  const loginContainer = document.querySelector('.login-connexion');
  const registerContainer = document.querySelector('.login-register');

   if (!loginContainer || !registerContainer) return;
  if (loginConnexion) loginConnexion.style.display = "flex";
  if (registerConnexion) registerConnexion.style.display = "none";

  if (errorLogin) errorLogin.textContent = "";
  if (errorRegister) errorRegister.textContent = "";
};

const showRegisterPanel = (e) => {
  e.preventDefault();
  if (loginConnexion) loginConnexion.style.display = "none";
  if (registerConnexion) registerConnexion.style.display = "flex";

  if (errorLogin) errorLogin.textContent = "";
  if (errorRegister) errorRegister.textContent = "";
};

const bascule = () => {
  if (registerBascule) {
    registerBascule.addEventListener("click", showRegisterPanel);
  }
  if (loginBascule) {
    loginBascule.addEventListener("click", showLoginPanel);
  }
};

document.addEventListener("DOMContentLoaded", async (e) => {
  if (formLogin) {
    formLogin.addEventListener("submit", login);
  }
  if (formRegister) {
    formRegister.addEventListener("submit", register);
  }

  bascule();
});
