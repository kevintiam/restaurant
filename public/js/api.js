

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
      // Redirection si non authentifié
      if (response.status === 401 && errorData.redirectUrl) {
        window.location.href = errorData.redirectUrl;
        return;
      }
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

const getPanierItems = async () => {
  try {
    const response = await fetch("/panier/all");
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur API (getPanierItems):", error.message);
    throw error;
  }
};
const viderPanier = async () => {
  try {
    const response = await fetch("/panier/vider", {
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

const validerCommande = async (
  adresseLivraison,
  nomComplet,
  telephone,
  courriel
) => {
  const data = {
    adresse_livraison: adresseLivraison,
    nom_complet: nomComplet,
    telephone: telephone,
    courriel: courriel,
  };

  try {
    const response = await fetch("/commande/soumettre", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      // Redirection si non authentifié
      if (response.status === 401 && errorData.redirectUrl) {
        window.location.href = errorData.redirectUrl;
        return;
      }
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }
    
    const commande = await response.json();
    console.log(commande);
    return commande;
  } catch (error) {
    console.error("Erreur API (validerCommande):", error.message);
    throw error;
  }
};

// fonction pour le calcul
const calculateOrderTotals = async (itemsPourRecu, TAXE, TRANSPORT_RATE) => {
  const sousTotal = itemsPourRecu.reduce((somme, item) => {
    const itemPrice = item.quantite * item.prix;
    return somme + itemPrice;
  }, 0);

  const transport = sousTotal * TRANSPORT_RATE;
  const taxe = sousTotal * TAXE;
  const totalFinal = sousTotal + taxe + transport;

  return {
    sousTotal: sousTotal.toFixed(2),
    taxe: taxe.toFixed(2),
    transport: transport.toFixed(2),
    totalFinal: totalFinal.toFixed(2),
  };
};

// fonction pour ajouter un nouvel utilisateur (creer)
const creerACount = async (name, subname, passwd, categorie, email) => {
  const newUser = {
    nom: name,
    prenom: subname,
    mot_de_passe: passwd,
    courriel: email,
    id_type_utilisateur: parseInt(categorie), // Convertir en nombre
  };
  try {
    const response = await fetch("/user/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error( error.message);
    throw error;
  }
};

// fonction pour se connecter
const loginUser = async (courriel, passwd) => {
  const user = { courriel: courriel, mot_de_passe: passwd };
  try {
    const response = await fetch("/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || `Erreur HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error.message);
    throw error;
  }
};

//fonction pour se deconnecter
const logout = async () => {
  try {
    const response = await fetch("/user/logout", {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      console.warn("Erreur lors de la déconnexion côté serveur");
    }
  } catch (error) {
    console.error("Erreur réseau lors de la déconnexion :", error);
  } finally {
    sessionStorage.clear();
    window.location.href = "/";
  }
};

export {
  addPanier,
  removeToPanier,
  updatePanierQuantity,
  getTotalCartItemsAPI,
  viderPanier,
  validerCommande,
  getPanierItems,
  calculateOrderTotals,
  creerACount,
  loginUser,
  logout
};
