import { removeToPanier, updatePanierQuantity, viderPanier } from "./api.js";
import { animateButton, showMessage, updateCartBadge } from "./menu.js";
import { isIdValid, isValidQuantity } from "./validation.js";
import { calculateOrderTotals } from "../../model/restaurant.js";

const panierContain = document.getElementById("panier-items");

const updateSummary = async () => {
  try {
    const allItems = panierContain.querySelectorAll(".item");
    const calcul = await calculateOrderTotals(allItems, 0.2, 0.1);

    const shipping = document.getElementById("transport");
    const taxeRate = document.getElementById("taxe");
    const totalPrice = document.getElementById("total-price");
    const sousTotal = document.getElementById("sous-total");

    if (shipping) shipping.textContent = `${calcul.transport} $CAD`;
    if (taxeRate) taxeRate.textContent = `${calcul.taxe} $CAD`;
    if (totalPrice) totalPrice.textContent = `${calcul.totalFinal} $CAD`;
    if (sousTotal) sousTotal.textContent = `${calcul.sousTotal} $CAD`;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du résumé:", error);
  }
};

// Gestion de la quantité
const handleQuantityChange = async (itemElement, newQuantity) => {
  const id = itemElement.dataset.idProduit;
  
  if (!isIdValid(id)) {
    showMessage("ID de produit invalide");
    return false;
  }

  if (!isValidQuantity(newQuantity)) {
    showMessage("Quantité invalide");
    return false;
  }

  try {
    await updatePanierQuantity(id, newQuantity);
    return true;
  } catch (error) {
    showMessage("Erreur lors de la mise à jour");
    return false;
  }
};

// Suppression d'un article
const handleRemoveItem = async (itemElement) => {
  const id = itemElement.dataset.idProduit;
  
  if (!isIdValid(id)) {
    showMessage("ID de produit invalide");
    return;
  }

  try {
    const resultat = await removeToPanier(id);
    itemElement.remove();
    showMessage(resultat.message, "success");
    await updateSummary();
    await updateCartBadge();
  } catch (error) {
    showMessage("Erreur lors de la suppression");
  }
};

// Gestion des événements de quantité
const updateQuantity = async (e) => {
  const itemElement = e.target.closest(".item");
  if (!itemElement) return;

  const quantitySpan = itemElement.querySelector(".item-quantity span");
  if (!quantitySpan) return;

  let currentQuantity = parseInt(quantitySpan.textContent);

  // Suppression
  if (e.target.closest(".btn-supprimer")) {
    await handleRemoveItem(itemElement);
    return;
  }

  // Augmentation
  if (e.target.closest(".btn-increase")) {
    currentQuantity++;
    const success = await handleQuantityChange(itemElement, currentQuantity);
    if (success) {
      quantitySpan.textContent = currentQuantity;
      await updateSummary();
      await updateCartBadge();
    }
    return;
  }

  // Diminution
  if (e.target.closest(".btn-decrease")) {
    if (currentQuantity > 1) {
      currentQuantity--;
      const success = await handleQuantityChange(itemElement, currentQuantity);
      if (success) {
        quantitySpan.textContent = currentQuantity;
        await updateSummary();
        await updateCartBadge();
      }
    } else {
      // Supprimer si quantité = 1
      await handleRemoveItem(itemElement);
    }
  }
};

// Vider le panier
const viderPanierTotal = async () => {
  const vider = document.getElementById("btn-vider-panier");
  if (!vider) return;

  vider.addEventListener("click", async () => {
    try {
      const resultat = await viderPanier();
      
      if (resultat && resultat.success !== false) {
        if (panierContain) {
          panierContain.innerHTML = "";
        }
        animateButton(vider);
        await updateSummary();
        await updateCartBadge();
        showMessage(resultat.message, "success");
      } else {
        showMessage(resultat?.message || "Erreur lors du vidage du panier", "error");
      }
    } catch (error) {
      showMessage("Erreur lors du vidage du panier", "error");
    }
  });
};

// Initialisation
const initPanier = async () => {
  await updateCartBadge();
  
  if (panierContain) {
    await viderPanierTotal();
    panierContain.addEventListener("click", updateQuantity);
    await updateSummary();
  }
};

document.addEventListener("DOMContentLoaded", initPanier);