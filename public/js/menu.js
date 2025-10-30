import { addPanier, getTotalCartItemsAPI } from "./api.js";
import { isValidQuantity, isArticleValid } from "./validation.js";

const handleProductActions = async (e) => {
  const card = e.target.closest(".product-card");
  if (!card) return;

  const quantity = card.querySelector(".quantity");
  if (!quantity) {
    return;
  }

  const quantityText = quantity.textContent.trim();
  if (!isValidQuantity(quantityText)) {
    showMessage("Quantite invalide");
    return;
  }
  let number = parseInt(quantityText);

  // bouton ajouter
  if (e.target.closest(".btn-add")) {
    number++;
    quantity.textContent = number;
  }

  // bouton retirer
  if (e.target.closest(".btn-remove")) {
    if (number > 1) {
      number--;
      quantity.textContent = number;
    }
  }

  // bouton ajouter
  if (e.target.closest(".btn-valider")) {
    const quantityFinal = parseInt(quantity.textContent);
    await addToCard(card, quantityFinal);
  }
};

const addToCard = async (card, quantity) => {
  const productId = card.dataset.productId;
  const productName = card.querySelector(".product-name").textContent.trim();
  const button = card.querySelector(".btn-valider");

  if (!isArticleValid(productId, quantity)) {
    showMessage("Aritclee incorrecte");
    return;
  }

  try {
    animateButton(button);
    const response = await addPanier(productId, quantity);
    await updateCartBadge();
    showMessage(
      `✅ ${productName} (x${quantity}) ajouté au panier !`,
      "success"
    );
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error);
    showMessage("Erreur lors de l'ajout au panier", "error");
  }
};
const updateCartBadge = async () => {
  const cartCountElement = document.getElementById("cartCount");
  if (cartCountElement) {
    try {
      const totalItems = await getTotalCartItemsAPI();
      cartCountElement.textContent = totalItems;
    } catch (error) {
      console.error("Impossible de mettre à jour le badge du panier:", error);
    }
  }
};

const showMessage = (message, type) => {
  const messageDiv = document.createElement("div");
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: bold;
    z-index: 10000;
    background: ${type === "success" ? "#27ae60" : "#e74c3c"};
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  messageDiv.textContent = message;

  document.body.appendChild(messageDiv);

  // Supprimer après 3 secondes
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
};

const animateButton = (button) => {
  if (!button) return;
  const originalText = button.innerHTML;

  // Animation
  button.disabled = true;
  button.innerHTML = '<i class="fas fa-check"></i> Ajouté !';
  button.style.background = "#27ae60";

  setTimeout(() => {
    button.disabled = false;
    button.innerHTML = originalText;
    button.style.background = "";
  }, 2000);
};

const initProduits = async () => {
  await updateCartBadge();

  const productsContainer = document.querySelector(".product-container");
  if (productsContainer) {
    productsContainer.addEventListener("click", handleProductActions);
  }
};

document.addEventListener("DOMContentLoaded", initProduits);

export { animateButton, showMessage, updateCartBadge };
