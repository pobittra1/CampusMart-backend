import { prisma } from "../../lib/prisma";

const applyForSeller = async (userId: string, reason?: string) => {
  const existingApplication = await prisma.sellerApplication.findFirst({
    where: {
      userId,
      status: "PENDING",
    },
  });

  if (existingApplication) {
    throw new Error("You already have a pending application!");
  }

  return prisma.sellerApplication.create({
    data: {
      userId,
      reason,
    },
  });
};

export const sellerService = {
  applyForSeller,
};
