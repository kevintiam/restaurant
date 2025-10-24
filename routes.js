import { Router } from "express";
const router = Router();

// Définition des routes

// route pour la page d'accueil
router.get("/", async (req, res) => {
  res.render("home", {
    title: "Todo",
    styles: ["./css/header.css"],
    scripts: ["./js/header.js"],
  });
});

router.get("/contact", (req, res) => {
  res.render("contact", {
    title: "contact",
    styles: ["./css/header.css"],
    scripts: ["./js/header.js"],
  });
});
export default router;
