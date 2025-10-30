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
    const resultat = await validerCommande(
      adresse.value.trim(),
      nomComplet.value.trim(),
      telephone.value.trim(),
      courriel
    );

    console.log("Résultat complet:", resultat);
    console.log("ID de commande:", resultat.order?.id);
    console.log("Items de commande:", resultat.order?.items);

    // Afficher le reçu AVANT de masquer le panier
    if (resultat.order) {
      afficherRecu(resultat.order);
    }

    // Masquer le panier et afficher le reçu
    panierContainer.style.display = "none";
    recu.style.display = "block";

  } catch (error) {
    console.error("Erreur de soumission:", error.message);
    alert(`Erreur lors de la commande: ${error.message}`);
  } finally {
    // Réactiver le bouton dans tous les cas
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonHtml;
  }
};

if (orderForm) {
  orderForm.addEventListener("submit", submitForm);
}

const afficherRecu = (order) => {
  console.log("Order dans afficherRecu:", order);
  console.log("Items:", order.items);

  if (!order) {
    console.error("Order invalide");
    return;
  }
  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
  console.warn("Aucun article à afficher – vérifie la réponse de l’API.");
}

  const listeProdruits = order.items && Array.isArray(order.items)
    ? order.items.map((produit) => `
        <li data-id="${produit.id_produit}">
          <span>${produit.quantite} x ${produit.nom}</span>
          <span>${(produit.prix * produit.quantite).toFixed(2)} $CAD</span>
        </li>
      `).join("")
    : '<li>Aucun produit</li>';

  const dateRecu = new Date().toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const heureRecu = new Date().toLocaleTimeString("fr-CA", {
    hour: "2-digit",
    minute: "2-digit",
  });


  recu.innerHTML = `
    <div class="order-receipt">
      <div class="receipt-header">
        <i class="fas fa-check-circle success-icon"></i>
        <h4>Commande Confirmée !</h4>
        <p>Merci pour votre commande, ${order.nomClient}!</p>
        <p class="order-number">Numéro de commande : #${order.id || "N/A"}</p>
        <p>Date : ${dateRecu} à ${heureRecu}</p>
      </div>

      <div class="receipt-section">
        <h5>Articles Commandés</h5>
        <ul class="receipt-items-list">
          ${listeProdruits}
        </ul>
      </div>

      <div class="receipt-section">
        <h5>Résumé du Paiement</h5>
        <div class="receipt-total-line">
          <span>Sous-total :</span>
          <span>${order.sousTotal} $CAD</span>
        </div>
        <div class="receipt-total-line">
          <span>Livraison :</span>
          <span>${order.transport} $CAD</span>
        </div>
        <div class="receipt-total-line">
          <span>Taxes (TVA) :</span>
          <span>${order.taxes} $CAD</span>
        </div>
        <div class="receipt-total-line final">
          <span>Total Payé :</span>
          <span>${order.total} $CAD</span>
        </div>
        <p class="payment-method-note">Méthode: Carte de crédit</p>
      </div>

      <div class="receipt-section">
        <h5>Livraison à</h5>
        <div class="address-info">
          <p>${order.nomClient}</p>
          <p>${order.adresse}</p>
          <p>Téléphone: ${order.telephone}</p>
          <p>Courriel: ${order.courriel}</p>
        </div>
      </div>

      <div class="receipt-footer">
        <p>Un courriel de confirmation sera envoyé à ${order.adresse.courriel}.</p>
        <a href="/" class="btn-back-home">Retour à l'accueil</a>
      </div>
    </div>
  `;
};