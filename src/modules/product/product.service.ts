import type { Product } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createProduct = async (
  data: Omit<Product, "id" | "createdAt" | "updatedAt">,
) => {
  const result = await prisma.product.create({
    data,
  });
};

const getAllPost = async (payload: { search: string | undefined }) => {
  console.log(payload);
  const result = await prisma.product.findMany({
    where: {
      name: {
        contains: payload.search,
        mode: "insensitive",
      },
    },
  });
  return result;
};

export const productService = {
  createProduct,
  getAllPost,
};
