import { Router } from "express";
import { getAllProducts } from "./model/restaurant.js";
const router = Router();

// Définition des routes

// route pour la page d'accueil
router.get("/", async (req, res) => {
  res.render("menu", {
    title: "Todo",
    styles: ["./css/header.css", "./css/menu.css"],
    scripts: ["./js/header.js"],
    products: await getAllProducts(),
  });
});

router.get("/all-products", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
    console.log(products);
  } catch (error) {
    console.error("❌ Erreur dans /allProducts :", error);
    res.status(500).json({ error: error.message });
  }
});
export default router;
