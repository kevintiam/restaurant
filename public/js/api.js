// fonction pour ajouter un article au panier.

const addPanier = async (id_produit, quantite) => {
  try {
    const response = await fetch("/panier/ajouter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_produit: id_produit,
        quantite: quantite,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error.message);
    throw error;
  }
};

const removeToPanier = async (id) => {
  try {
    const response = await fetch(`/panier/supprimer/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article:", error.message);
    throw error;
  }
};

const updatePanierQuantity = async (id, nouvelleQuantite) => {
  try {
    const response = await fetch(`/panier/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quantite: nouvelleQuantite,
      }),
    });
    if (!response.ok) {
      throw new Error((await response.json()).message);
    }
    return await response.json();
  } catch (error) {
    console.error("Erreur API (updatePanierQuantity):", error.message);
    throw error;
  }
};

const getTotalCartItemsAPI = async () => {
  try {
    const response = await fetch("/panier/total-items");

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.totalItems;
  } catch (error) {
    console.error("Erreur API (getTotalCartItemsAPI):", error.message);
    throw error;
  }
};
export {
  addPanier,
  removeToPanier,
  updatePanierQuantity,
  getTotalCartItemsAPI,
};
