// seed.js
import { PrismaClient } from "@prisma/client";

async function main() {
  console.log("🍛 Insertion des plats africains...");
  
  let prisma;
  
  try {
    // Initialiser Prisma Client
    prisma = new PrismaClient();
    
    // Tester la connexion
    await prisma.$connect();
    console.log("✅ Connecté à la base de données");

    const plats = [
      {
        nom: "Alloco",
        prix: 8.5,
        categorie: "plat",
        description: "Bananes plantain mûres frites à la perfection, croustillantes à l'extérieur et fondantes à l'intérieur, servies avec une sauce piquante maison et au choix : œuf poché ou thon émietté.",
        chemin_image: "/images/Alloco.png",
      },
      {
        nom: "Attieke",
        prix: 12.0,
        categorie: "plat",
        description: "Semoule légère et aérée de manioc fermenté, accompagnée d'un poisson braisé au feu de bois et d'une sauce relevée aux tomates et piments.",
        chemin_image: "/images/Attieke.png",
      },
      {
        nom: "Poulet DG",
        prix: 18.75,
        categorie: "plat",
        description: "Poulet tendre sauté avec des plantains mûrs, des poivrons, des oignons et des épices aromatiques. Un plat festif originaire de Côte d'Ivoire, idéal pour les amateurs de saveurs riches et généreuses.",
        chemin_image: "/images/Poulet_DG.png",
      },
      {
        nom: "Ndolè",
        prix: 15.5,
        categorie: "plat",
        description: "Feuilles de ndolè mijotées lentement avec de la viande, du poisson fumé et une purée d'arachides onctueuse. Un classique camerounais au goût profond et réconfortant.",
        chemin_image: "/images/ndole.webp",
      },
      {
        nom: "Poisson Braisé",
        prix: 16.25,
        categorie: "plat",
        description: "Poisson entier grillé au charbon de bois pour une saveur fumée inimitable, servi avec une portion d'alloco croustillant et une sauce pimentée maison.",
        chemin_image: "/images/Poisson_Braiser.png",
      },
      {
        nom: "Mbongo Tchobi",
        prix: 17.8,
        categorie: "plat",
        description: "Sauce noire intense et épicée, préparée à base d'écorce de mbongo, de poisson fumé et d'épices traditionnelles. Une spécialité du Cameroun qui ravira les amateurs de plats audacieux.",
        chemin_image: "/images/Mbongo.png",
      },
      {
        nom: "Koki",
        prix: 9.99,
        categorie: "plat",
        description: "Gâteau moelleux à base de purée de haricots noirs, mélangé à de l'huile de palme et cuit dans des feuilles de bananier pour un parfum authentique et une texture unique.",
        chemin_image: "/images/Koki.png",
      },
      {
        nom: "Eru",
        prix: 14.25,
        categorie: "plat",
        description: "Mélange savoureux de feuilles d'eru et de waterleaf, mijoté avec de la viande, du poisson fumé et de l'huile de palme. Un plat emblématique du Cameroun, riche en saveurs et en tradition.",
        chemin_image: "/images/Eru.png",
      },
      {
        nom: "Placali",
        prix: 6.5,
        categorie: "plat",
        description: "Pâte ferme de manioc fermenté, cuite à la vapeur et servie avec une sauce graine onctueuse ou une sauce claire aux tomates. Un accompagnement incontournable des repas ouest-africains.",
        chemin_image: "/images/Placali.png",
      },
      {
        nom: "Pomme Pile",
        prix: 5.75,
        categorie: "plat",
        description: "Purée de pommes de terre relevée d'oignons, d'ail et d'épices locales, mijotée jusqu'à obtenir une texture crémeuse et savoureuse. Une touche africaine à un classique universel.",
        chemin_image: "/images/Pomme_Pile.png",
      },
      {
        nom: "Taro Sauce Jaune",
        prix: 6.0,
        categorie: "plat",
        description: "Tubercules de taro cuits à la perfection, accompagnés d'une sauce jaune légèrement épicée à base de curcuma et de tomates fraîches. Un duo doux et réconfortant.",
        chemin_image: "/images/Taro.png",
      },
      {
        nom: "Sangah",
        prix: 4.5,
        categorie: "plat",
        description: "Purée veloutée de feuilles de manioc fondantes, mijotée avec du jus de noix de palme et des grains de maïs frais. Un plat traditionnel du Centre Cameroun, parfait pour accompagner du riz ou du manioc bouilli.",
        chemin_image: "/images/Sanga.png",
      },
      {
        nom: "attikie",
        prix: 3.75,
        categorie: "plat",
        description: "Sauce légère et visqueuse à base de gombo frais, relevée d'oignons, de piments et d'épices. Un accompagnement populaire, apprécié pour sa texture unique et ses bienfaits nutritionnels.",
        chemin_image: "/images/aitekier.webp",
      },
      {
        nom: "Met de Pistache",
        prix: 3.25,
        categorie: "plat",
        description: "Gâteau festif enrobé de graines de courge, cuit en feuilles de bananier et agrémenté de viande ou de poisson ; un plat d'honneur de l'Est-Cameroun, servi avec des ignames vapeur pour les grandes occasions.",
        chemin_image: "/images/Pistache.png",
      },
      {
        nom: "BHB",
        prix: 4.5,
        categorie: "plat",
        description: "Beignets moelleux à base d'haricots bouillis mixés, assaisonnés et frits à la perfection. Un classique réconfortant de la cuisine ouest-africaine, souvent servi en collation ou en accompagnement.",
        chemin_image: "/images/BHB.png",
      },
      {
        nom: "Okok",
        prix: 5.0,
        categorie: "plat",
        description: "Plat traditionnel camerounais riche et savoureux préparé à partir de feuilles finement hachées de la vigne Gnetum africanum.",
        chemin_image: "/images/Iokoo.png",
      },
    ];

    let platsCrees = 0;
    let erreurs = 0;

    for (const plat of plats) {
      try {
        const result = await prisma.produit.create({
          data: plat,
        });
        console.log(`✅ ${plat.nom} ajouté (ID: ${result.id_produit})`);
        platsCrees++;
      } catch (error) {
        console.log(`❌ Erreur avec ${plat.nom}:`, error.message);
        erreurs++;
      }
    }

    console.log("\n🎉 Insertion terminée!");
    console.log(`📊 Statistiques:`);
    console.log(`   - ${platsCrees} plats créés avec succès`);
    console.log(`   - ${erreurs} erreurs`);

  } catch (error) {
    console.error("❌ Erreur générale:", error);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
      console.log("🔌 Déconnecté de la base de données");
    }
  }
}

// Exécuter le script
main().catch((e) => {
  console.error("❌ Erreur fatale:", e);
  process.exit(1);
});