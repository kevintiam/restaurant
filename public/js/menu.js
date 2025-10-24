document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.querySelector(".product-container");

  if (!productsContainer) {
    return;
  }

  productsContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");

    if (!card) return;
    const quantity = card.querySelector(".quantity");
    let number = parseInt(quantity.textContent.trim());

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
      const productId = card.dataset.productId;
      const productName = card.querySelector(".product-name").textContent.trim();
      const quantityElemt = parseInt(quantity.textContent);

      updateCartCount();

      showMessage( `✅ ${productName} (x${quantityElemt}) ajouté au panier !`,"success");

      animateButton(e.target.closest(".btn-valider"));
    }
  });
});

const updateCartCount = () => {
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    let currentCount = parseInt(cartCount.textContent) || 0;
    currentCount++;
    cartCount.textContent = currentCount;
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
}
