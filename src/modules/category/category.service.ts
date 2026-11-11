import type { Category, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createCategory = async (data: Prisma.CategoryCreateInput) => {
  const result = await prisma.category.create({
    data,
  });
};

export const categoryService = {
  createCategory,
};
