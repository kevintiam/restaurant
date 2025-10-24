import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// fonction pour recuperer tous les produits

const getAllProducts = async () => {
  return await prisma.produit.findMany();
};

export { getAllProducts };