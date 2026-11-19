import type { Product } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createProduct = async (
  data: Omit<Product, "id" | "createdAt" | "updatedAt">,
) => {
  const result = await prisma.product.create({
    data,
  });
};

const getAllPost = async () => {
  const result = await prisma.product.findMany();
  return result;
};

export const productService = {
  createProduct,
  getAllPost,
};
