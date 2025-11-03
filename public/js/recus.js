import { validerCommande } from "./api.js";
import { isEmailValid, isNomValid, isTelephoneValid,isAdresseValid } from "./validation.js";
import { showMessage,updateCartBadge } from "./menu.js";

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
  if (!submitButton) {
    showMessage("Erreur: Bouton de soumission non trouvé", "error");
    return;
  }
  const originalButtonHtml = submitButton.innerHTML;

  if (
    !isAdresseValid(adresse.value) ||
    !isNomValid(nomComplet.value) ||
    !isTelephoneValid(telephone.value)
  ) {
    showMessage("Veuillez remplir tous les champs obligatoires.", "error");
    return;
  }
  if (!isEmailValid(courriel)) {
    showMessage("Veuillez saisir une adresse email valide", "error");
    return;
  }

  // Animation de chargement
  submitButton.disabled = true;
  submitButton.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Traitement...';

  try {
    const resultat = await validerCommande(
      adresse.value,
      nomComplet.value,
      telephone.value,
      courriel
    );

    // Afficher le reçu AVANT de masquer le panier
    if (resultat.order) {
      afficherRecu(resultat.order);
    }

    // Masquer le panier et afficher le reçu
    if (panierContainer) panierContainer.style.display = "none";
    if (recu) recu.style.display = "block";

    orderForm.reset();
    panierContainer.innerHTML = "";
    await updateCartBadge();
  } catch (error) {
    console.error("Erreur de soumission:", error.message);
    showMessage(`Erreur lors de la commande: ${error.message}`, "error");
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
  if (!order || !recu) {
    console.error("Order invalide ou élément recu non trouvé");
    return;
  }

  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    console.warn("Aucun article à afficher – vérifie la réponse de l’API.");
  }

  const listeProdruits =
    order.items && Array.isArray(order.items)
      ? order.items
          .map(
            (produit) => `
        <li data-id="${produit.id_produit}">
          <span>${produit.quantite} x ${produit.nom}</span>
          <span>${(produit.prix * produit.quantite).toFixed(2)} $CAD</span>
        </li>
      `
          )
          .join("")
      : "<li>Aucun produit</li>";

  const dateRecu = new Date().toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const heureRecu = new Date().toLocaleTimeString("fr-CA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const nomClient = order.nomClient || "Client";
  const adresseLivraison = order.adresse || "Non spécifiée";
  const telephoneClient = order.telephone || "Non spécifié";
  const emailClient = order.courriel || "Non spécifié";
  const idCommande = order.id || "N/A";
  const sousTotal = order.sousTotal || 0;
  const transport = order.transport || 0;
  const taxes = order.taxes || 0;
  const total = order.total || 0;

  recu.innerHTML = `
    <div class="order-receipt">
      <div class="receipt-header">
        <i class="fas fa-check-circle success-icon"></i>
        <h4>Commande Confirmée !</h4>
        <p>Merci pour votre commande, ${nomClient}!</p>
        <p class="order-number">Numéro de commande : #${idCommande}</p>
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
          <span>${sousTotal} $CAD</span>
        </div>
        <div class="receipt-total-line">
          <span>Livraison :</span>
          <span>${transport} $CAD</span>
        </div>
        <div class="receipt-total-line">
          <span>Taxes (TVA) :</span>
          <span>${taxes} $CAD</span>
        </div>
        <div class="receipt-total-line final">
          <span>Total Payé :</span>
          <span>${total} $CAD</span>
        </div>
        <p class="payment-method-note">Méthode: Carte de crédit</p>
      </div>

      <div class="receipt-section">
        <h5>Livraison à</h5>
        <div class="address-info">
          <p>${nomClient}</p>
          <p>${adresseLivraison}</p>
          <p>Téléphone: ${telephoneClient}</p>
          <p>Courriel: ${emailClient}</p>
        </div>
      </div>

      <div class="receipt-footer">
        <p>Un courriel de confirmation sera envoyé à ${emailClient}.</p>
        <a href="/" class="btn-back-home">Retour à l'accueil</a>
      </div>
    </div>
  `;
};
