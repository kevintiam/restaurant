import { logout } from "./api.js";

// Fonction pour vérifier si l'utilisateur est connecté
const checkSession = async () => {
  try {
    const response = await fetch("/user/session");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la vérification de session:", error);
    return { isAuthenticated: false };
  }
};

// Fonction pour afficher les informations de l'utilisateur dans le header
const displayUserInfo = async () => {
  const session = await checkSession();
  
  const userInfoContainer = document.getElementById("user-info");
  if (!userInfoContainer) return;
  
  if (session.isAuthenticated && session.user) {
    userInfoContainer.innerHTML = `
      <div class="user-menu">
        <span class="user-name">Bonjour, ${session.user.prenom} ${session.user.nom}</span>
        <button id="logout-btn" class="btn-logout">Déconnexion</button>
      </div>
    `;
    
    // Ajouter l'événement de déconnexion
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout);
    }
  } else {
    userInfoContainer.innerHTML = `
      <a href="/login" class="btn-login">Connexion</a>
    `;
  }
};

// Fonction pour protéger une page (rediriger si non connecté)
const requireAuth = async (redirectTo = "/") => {
  const session = await checkSession();
  if (!session.isAuthenticated) {
    window.location.href = redirectTo;
  }
  return session;
};

export { checkSession, logout, displayUserInfo, requireAuth };
