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
        description:
          "Bananes plantain frites croustillantes, servies avec une sauce piquante maison et au choix : œuf poché ou thon.",
        chemin_image: "/images/Alloco.png",
      },
      {
        nom: "Attieke",
        prix: 12.0,
        categorie: "plat",
        description:
          "Semoule aérée de manioc fermenté, accompagnée de poisson braisé et d’une sauce tomate-piment.",
        chemin_image: "/images/Attieke.png",
      },
      {
        nom: "Poulet DG",
        prix: 18.75,
        categorie: "plat",
        description:
          "Poulet sauté avec plantains mûrs, poivrons, oignons et épices — un plat festif ivoirien.",
        chemin_image: "/images/Poulet_DG.png",
      },
      {
        nom: "Ndolè",
        prix: 15.5,
        categorie: "plat",
        description:
          "Feuilles de ndolè mijotées avec viande, poisson fumé et purée d’arachides — un classique camerounais.",
        chemin_image: "/images/ndole.webp",
      },
      {
        nom: "Poisson Braisé",
        prix: 16.25,
        categorie: "plat",
        description:
          "Poisson entier grillé au charbon, servi avec alloco croustillant et sauce pimentée.",
        chemin_image: "/images/Poisson_Braiser.png",
      },
      {
        nom: "Mbongo Tchobi",
        prix: 17.8,
        categorie: "plat",
        description:
          "Sauce noire épicée à base d’écorce de mbongo, poisson fumé et épices — une spécialité audacieuse du Cameroun.",
        chemin_image: "/images/Mbongo.png",
      },
      {
        nom: "Koki",
        prix: 9.99,
        categorie: "plat",
        description:
          "Gâteau moelleux de haricots noirs à l’huile de palme, cuit dans des feuilles de bananier.",
        chemin_image: "/images/Koki.png",
      },
      {
        nom: "Eru",
        prix: 14.25,
        categorie: "plat",
        description:
          "Feuilles d’eru et waterleaf mijotées avec viande, poisson fumé et huile de palme.",
        chemin_image: "/images/Eru.png",
      },
      {
        nom: "Placali",
        prix: 6.5,
        categorie: "plat",
        description:
          "Pâte ferme de manioc fermenté, servie avec sauce graine ou tomate.",
        chemin_image: "/images/Placali.png",
      },
      {
        nom: "Pomme Pile",
        prix: 5.75,
        categorie: "plat",
        description:
          "Purée de pommes de terre relevée d’oignons, ail et épices locales.",
        chemin_image: "/images/Pomme_Pile.png",
      },
      {
        nom: "Taro Sauce Jaune",
        prix: 6.0,
        categorie: "plat",
        description:
          "Taro tendre avec une sauce jaune épicée au curcuma et tomates fraîches.",
        chemin_image: "/images/Taro.png",
      },
      {
        nom: "Sangah",
        prix: 4.5,
        categorie: "plat",
        description:
          "Purée de feuilles de manioc, jus de noix de palme et maïs frais — spécialité du Centre Cameroun.",
        chemin_image: "/images/Sanga.png",
      },
      {
        nom: "attikie",
        prix: 3.75,
        categorie: "plat",
        description:
          "Sauce visqueuse de gombo frais, oignons et piments — accompagnement nutritif et savoureux.",
        chemin_image: "/images/aitekier.webp",
      },
      {
        nom: "Met de Pistache",
        prix: 3.25,
        categorie: "plat",
        description:
          "Gâteau en feuilles de bananier garni de viande ou poisson, enrobé de graines de courge.",
        chemin_image: "/images/Pistache.png",
      },
      {
        nom: "BHB",
        prix: 4.5,
        categorie: "plat",
        description:
          "Beignets moelleux d’haricots bouillis, frits à la perfection — collation ouest-africaine.",
        chemin_image: "/images/BHB.png",
      },
      {
        nom: "Okok",
        prix: 5.0,
        categorie: "plat",
        description:
          "Feuilles de vigne Gnetum africanum finement hachées, mijotées à la camerounaise.",
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
