import { validerCommande } from "./api.js";

const orderForm = document.querySelector(".panier-resume form");
const panierContainer = document.getElementById("panier-container");
const recu = document.getElementById("order-receipt");

const submitForm = async (e) => {
  e.preventDefault();

  const adresse = document.getElementById("adresse_livraison");
  const nomComplet = document.getElementById("titulaire_carte");
  const telephone = document.getElementById("numero_telephone"); 
  const courriel = "exemple@gmail.com";
  const submitButton = orderForm.querySelector(".btn-submit");
  const originalButtonHtml = submitButton.innerHTML;

  if (
    !adresse.value.trim() ||
    !nomComplet.value.trim() ||
    !telephone.value.trim()
  ) {
    alert("Veuillez remplir tous les champs obligatoires.");
    return;
  }

  // Animation de chargement
  submitButton.disabled = true;
  submitButton.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Traitement...';

  console.log("Données de commande:", {
    adresse: adresse.value,
    nomComplet: nomComplet.value,
    telephone: telephone.value,
    courriel: courriel,
  });

  try {
    const resultat = await validerCommande(adresse.value.trim(),nomComplet.value.trim(),telephone.value.trim(),courriel);

    console.log("Commande réussie. Résultat:", resultat);

    // Masquer le panier et afficher le reçu
    panierContainer.style.display = "none";
    recu.style.display = "block";

    // CORRECTION : Afficher les détails du reçu si nécessaire
    if (resultat.order) {
      afficherRecu(resultat.order);
    }
  } catch (error) {
    console.error("Erreur de soumission:", error.message);
    alert(`Erreur lors de la commande: ${error.message}`);
  } finally {
    // Réactiver le bouton dans tous les cas
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonHtml;
  }
};

// Fonction pour afficher les détails du reçu
const afficherRecu = (order) => {
  const recuElement = document.getElementById("order-receipt");

  if (recuElement && order) {
    // Construction de la liste des produits sous forme de lignes de tableau
    const lignesProduits = order.produits
      .map(
        (produit) => `
      <tr>
        <td>${produit.nom}</td>
        <td class="text-center">${produit.quantite}</td>
        <td class="text-right">${produit.prixUnitaire.toFixed(2)} $</td>
        <td class="text-right">${produit.sousTotal.toFixed(2)} $</td>
      </tr>
    `
      )
      .join(""); // Joindre toutes les lignes en une seule chaîne

    // Pour un reçu plus professionnel, ajoutons la date actuelle
    const dateRecu = new Date().toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const heureRecu = new Date().toLocaleTimeString("fr-CA", {
      hour: "2-digit",
      minute: "2-digit",
    });

    recuElement.innerHTML = `
      <div class="recu-professionnel">
        <h2 class="recu-titre">Facture d'Achat</h2>
        
        <div class="recu-entete">
          <p><strong>Date:</strong> ${dateRecu} à ${heureRecu}</p>
          <p><strong>Numéro de commande:</strong> #${order.id}</p>
        </div>

        <div class="recu-informations-client">
          <p><strong>Client:</strong> ${order.nomClient}</p>
          <p><strong>Téléphone:</strong> ${order.telephoneClient}</p>
          <p><strong>Adresse de livraison:</strong> ${order.adresse}</p>
        </div>

        <h3 class="recu-sous-titre">Détails de la commande</h3>
        
        <table class="recu-table">
          <thead>
            <tr>
              <th>Article</th>
              <th class="text-center">Qté</th>
              <th class="text-right">Prix Unitaire</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${lignesProduits}
          </tbody>
        </table>

        <div class="recu-recapitulatif">
          <p><strong>Sous-total:</strong> <span>${(
            order.sousTotal || order.total
          ).toFixed(2)} $CAD</span></p>
          <p><strong>Taxes (TPS/TVQ):</strong> <span>${(
            order.taxes || 0
          ).toFixed(2)} $CAD</span></p>
          <p class="grand-total"><strong>Grand Total:</strong> <span>${order.total.toFixed(
            2
          )} $CAD</span></p>
        </div>
        
        <p class="recu-message">Merci pour votre commande! Un courriel de confirmation a été envoyé.</p>

        <button onclick="window.location.href='/'" class="btn-continuer-achats">
          Continuer les achats
        </button>
      </div>
    `;
  }
};
const afficherRecue = (order)=>{
  
}

document.addEventListener("DOMContentLoaded", () => {
  if (orderForm) {
    orderForm.addEventListener("submit", submitForm);
  }
});
