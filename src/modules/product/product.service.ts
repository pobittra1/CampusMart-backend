import {
  ProductCondition,
  type Product,
  type ProductStatus,
} from "../../../generated/prisma/client";
import type { ProductWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createProduct = async (
  data: Omit<Product, "id" | "createdAt" | "updatedAt">,
) => {
  const result = await prisma.product.create({
    data,
  });
};

const getAllPost = async ({
  search,
  condition,
  isFeatured,
  status,
  sellerId,
  page,
  limit,
  skip,
  shortBy,
  shortOrder,
}: {
  search?: string;
  condition?: ProductCondition;
  isFeatured: boolean | undefined;
  status: ProductStatus | undefined;
  sellerId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  shortBy: string | undefined;
  shortOrder: string | undefined;
}) => {
  console.log({ search, condition });

  const andConditions: ProductWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          category: {
            is: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    });
  }

  // Need to be exact match. / send condition value from backend NEW or USED capitalize
  if (condition) {
    andConditions.push({
      condition: {
        equals: condition as ProductCondition,
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    andConditions.push({
      isFeatured,
    });
  }

  if (status) {
    andConditions.push({
      status,
    });
  }
  const result = await prisma.product.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions,
    },
    orderBy:
      shortBy && shortOrder
        ? {
            [shortBy]: shortOrder,
          }
        : { createdAt: "desc" },
  });
  return result;
};

const toggleFeatured = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("Product not found!");
  }

  return await prisma.product.update({
    where: { id },
    data: {
      isFeatured: !product.isFeatured,
    },
  });
};

export const productService = {
  createProduct,
  getAllPost,
  toggleFeatured,
};
