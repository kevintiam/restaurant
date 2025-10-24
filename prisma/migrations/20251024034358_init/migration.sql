-- CreateTable
CREATE TABLE "TypeUtilisateur" (
    "id_type_utilisateur" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EtatCommande" (
    "id_etat_commande" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Produit" (
    "id_produit" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nom" TEXT NOT NULL,
    "chemin_image" TEXT,
    "prix" REAL NOT NULL,
    "categorie" TEXT,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id_utilisateur" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_type_utilisateur" INTEGER NOT NULL,
    "courriel" TEXT NOT NULL,
    "mot_de_passe" TEXT,
    "prenom" TEXT,
    "nom" TEXT,
    CONSTRAINT "Utilisateur_id_type_utilisateur_fkey" FOREIGN KEY ("id_type_utilisateur") REFERENCES "TypeUtilisateur" ("id_type_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Commande" (
    "id_commande" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_utilisateur" INTEGER NOT NULL,
    "id_etat_commande" INTEGER NOT NULL,
    "date" INTEGER NOT NULL,
    CONSTRAINT "Commande_id_utilisateur_fkey" FOREIGN KEY ("id_utilisateur") REFERENCES "Utilisateur" ("id_utilisateur") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Commande_id_etat_commande_fkey" FOREIGN KEY ("id_etat_commande") REFERENCES "EtatCommande" ("id_etat_commande") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CommandeProduit" (
    "id_commande" INTEGER NOT NULL,
    "id_produit" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,

    PRIMARY KEY ("id_commande", "id_produit"),
    CONSTRAINT "CommandeProduit_id_commande_fkey" FOREIGN KEY ("id_commande") REFERENCES "Commande" ("id_commande") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommandeProduit_id_produit_fkey" FOREIGN KEY ("id_produit") REFERENCES "Produit" ("id_produit") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_courriel_key" ON "Utilisateur"("courriel");
