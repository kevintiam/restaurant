import { removeToPanier, updatePanierQuantity } from "./api.js";
import { animateButton, showMessage, updateCartBadge } from "./menu.js";

const panierContain = document.getElementById("panier-items");
const TAXE = 0.2;
const TRANSPORT = 0.1;

const updateSummary = async () => {
  let subtotal = 0;
  const allItems = panierContain.querySelectorAll(".item");

  allItems.forEach((item) => {
    const unitPrice = parseFloat(item.dataset.prix);
    const quantity = parseInt(
      item.querySelector(".item-quantity span").textContent
    );

    if (!isNaN(unitPrice) && !isNaN(quantity)) {
      subtotal += unitPrice * quantity;
    }
  });

  const taxes = subtotal * TAXE;
  const transport = subtotal * TRANSPORT;

  const total = subtotal + taxes + transport;

  const shipping = document.getElementById("transport");
  const taxeRate = document.getElementById("taxe");
  const totalPrice = document.getElementById("total-price");
  const sousTotal = document.getElementById("sous-total");

  shipping.textContent = `${transport.toFixed(2)} $CAD`;
  taxeRate.textContent = `${taxes.toFixed(2)} $CAD`;
  totalPrice.textContent = `${total.toFixed(2)} $CAD`;
  sousTotal.textContent = `${subtotal.toFixed(2)} $CAD`;
};

// gerer l'augmentation de la quantite

const updateQuantity = async (e) => {
  await updateCartBadge();
  const itemElement = e.target.closest(".item");
  if (!itemElement) return;

  const id = itemElement.dataset.idProduit;
  const quantitySpan = itemElement.querySelector(".item-quantity span");
  let currentQuantity = parseInt(quantitySpan.textContent);

  // boutton supprimer
  if (e.target.closest(".btn-supprimer")) {
    itemElement.remove();
    const resultat = await removeToPanier(id);
    showMessage(resultat.message, "success");
    await updateSummary();
    await updateCartBadge();
  }

  if (e.target.closest(".btn-increase")) {
    currentQuantity++;
    quantitySpan.textContent = currentQuantity;
    await updatePanierQuantity(id, currentQuantity);
    await updateSummary();
    await updateCartBadge();
  }
  if (e.target.closest(".btn-decrease")) {
    if (currentQuantity > 1) {
      currentQuantity--;
      quantitySpan.textContent = currentQuantity;
      await updatePanierQuantity(id, currentQuantity);
      updateSummary();
      await updateCartBadge();
    } else if (currentQuantity === 1) {
      itemElement.querySelector(".btn-supprimer").click();
    }
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await updateCartBadge();
  if (panierContain) {
    panierContain.addEventListener("click", updateQuantity);
    updateSummary();
  }
});
