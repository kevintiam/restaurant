document.addEventListener("DOMContentLoaded", () => {
  const hambuger = document.getElementById("hambuger-menu");
  const menu = document.getElementById("menu-nav");
  const container = document.getElementById("container");
  const close = document.getElementById("close-menu");
  const menuLinks = menu.querySelectorAll("a");

  // Fonction pour ouvrir le menu
  const openMenu = () => {
    hambuger.style.display = "none";
    menu.style.display = "flex";
    document.body.style.overflow = "hidden";
    if (container) {
      container.classList.add("menu-open");
    }
  };

  // Fonction pour fermer le menu
  const closeMenu = () => {
    menu.style.display = "none";
    hambuger.style.display = "flex";
    document.body.style.overflow = "auto";
    if (container) {
      container.classList.remove("menu-open");
    }
  };

  // Gestionnaire pour les liens de menu
  const handleMenuLinkClick = (clickedLink) => {
    menuLinks.forEach((link) => {
      link.classList.remove("active");
    });

    // Ajouter la classe active au lien cliqué
    clickedLink.classList.add("active");

    // Fermer le menu sur mobile
    if (window.innerWidth < 768) {
      closeMenu();
    }
  };

  // Événements
  if (hambuger && menu) {
    hambuger.addEventListener("click", openMenu);
  } else {
    console.warn("Éléments #hambuger-menu ou #menu non trouvés.");
  }

  if (close) {
    close.addEventListener("click", closeMenu);
  } else {
    console.warn("Élément #close-menu non trouvé.");
  }

  if (menuLinks) {
    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        handleMenuLinkClick(link);
      });
    });
  }
});
