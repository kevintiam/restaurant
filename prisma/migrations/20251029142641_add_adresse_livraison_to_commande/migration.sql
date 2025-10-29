/*
  Warnings:

  - Added the required column `adresse_livraison` to the `Commande` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Commande" (
    "id_commande" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_utilisateur" INTEGER NOT NULL,
    "id_etat_commande" INTEGER NOT NULL,
    "date" INTEGER NOT NULL,
    "adresse_livraison" TEXT NOT NULL,
    CONSTRAINT "Commande_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur" ("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Commande_id_etat_commande_fkey" FOREIGN KEY ("id_etat_commande") REFERENCES "EtatCommande" ("id_etat_commande") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Commande" ("date", "id_commande", "id_etat_commande", "id_utilisateur") SELECT "date", "id_commande", "id_etat_commande", "id_utilisateur" FROM "Commande";
DROP TABLE "Commande";
ALTER TABLE "new_Commande" RENAME TO "Commande";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
