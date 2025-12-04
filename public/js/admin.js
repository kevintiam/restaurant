// Gestion de la page d'administration

document.addEventListener("DOMContentLoaded", () => {
  initializeStatusSelects();
  calculateStatistics();
});

/**
 * Initialise l'avatar utilisateur avec les initiales
 */


/**
 * Calcule et affiche les statistiques dynamiquement
 */
function calculateStatistics() {
  const rows = document.querySelectorAll("tbody tr");
  let livreesCount = 0;
  let attenteCount = 0;
  let revenuTotal = 0;
  
  rows.forEach((row) => {
    // Vérifier si ce n'est pas la ligne "Aucune commande"
    if (row.querySelector(".no-data")) return;
    
    // Compter les commandes livrées
    const statusBadge = row.querySelector(".status-badge");
    if (statusBadge) {
      const status = statusBadge.textContent.trim().toLowerCase();
      if (status.includes("livré") || status.includes("delivered")) {
        livreesCount++;
      } else if (status.includes("attente") || status.includes("pending")) {
        attenteCount++;
      }
    }
    
    // Calculer le revenu total
    const totalCell = row.querySelector(".total-amount");
    if (totalCell) {
      const amount = parseFloat(totalCell.textContent.replace("$", "").replace(",", ""));
      if (!isNaN(amount)) {
        revenuTotal += amount;
      }
    }
  });
  
  // Mettre à jour les statistiques
  const livreesElement = document.getElementById("livrees-count");
  const attenteElement = document.getElementById("attente-count");
  const revenuElement = document.getElementById("revenu-total");
  
  if (livreesElement) livreesElement.textContent = livreesCount;
  if (attenteElement) attenteElement.textContent = attenteCount;
  if (revenuElement) revenuElement.textContent = revenuTotal.toFixed(2) + "$";
}

/**
 * Initialise les sélecteurs de statut de commande
 */
function initializeStatusSelects() {
  const statusSelects = document.querySelectorAll(".status-select");
  
  statusSelects.forEach((select) => {
    select.addEventListener("change", async (e) => {
      const commandeId = e.target.dataset.commandeId;
      const newStatus = e.target.value;
      
      // Si l'option par défaut est sélectionnée, ne rien faire
      if (!newStatus || newStatus === e.target.querySelector("option[selected]").value) {
        return;
      }
      
      try {
        const response = await fetch(`/commandes/statut/${commandeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_etat_commande: parseInt(newStatus),
          }),
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de la mise à jour du statut");
        }
        
        const data = await response.json();
        
        // Afficher un message de succès
        showNotification("Statut mis à jour avec succès", "success");
        
        // Recharger la page après un court délai
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        console.error("Erreur:", error);
        showNotification("Erreur lors de la mise à jour du statut", "error");
        
        // Réinitialiser le sélecteur
        e.target.value = e.target.querySelector("option[selected]").value;
      }
    });
  });
}

/**
 * Affiche une notification temporaire
 * @param {string} message - Le message à afficher
 * @param {string} type - Le type de notification ('success' ou 'error')
 */
function showNotification(message, type = "info") {
  // Supprimer les notifications existantes
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notif) => notif.remove());
  
  // Créer la notification
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Ajouter la notification au body
  document.body.appendChild(notification);
  
  // Afficher la notification avec animation
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);
  
  // Masquer et supprimer la notification après 3 secondes
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}
