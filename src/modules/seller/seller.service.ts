import { prisma } from "../../lib/prisma";

const applyForSeller = async (userId: string, reason?: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user || user.role !== "BUYER") {
    throw new Error("Only buyers can apply for seller!");
  }

  const existingApplication = await prisma.sellerApplication.findFirst({
    where: {
      userId,
      status: "PENDING",
    },
  });

  if (existingApplication) {
    throw new Error("You already have a pending application!");
  }

  const applicationCount = await prisma.sellerApplication.count({
    where: {
      userId,
    },
  });

  if (applicationCount >= 3) {
    throw new Error("You can't apply more than 3 times!");
  }

  return prisma.sellerApplication.create({
    data: {
      userId,
      reason,
    },
  });
};

// const applyForSeller = async (userId: string, reason?: string) => {
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//     select: { role: true },
//   });

//   if (!user || user.role !== "BUYER") {
//     throw new Error("Only buyers can apply for seller!");
//   }

//   const existingApplication = await prisma.sellerApplication.findFirst({
//     where: {
//       userId,
//       status: "PENDING",
//     },
//   });

//   if (existingApplication) {
//     throw new Error("You already have a pending application!");
//   }

//   const applicationCount = await prisma.sellerApplication.count({
//     where: { userId },
//   });

//   if (applicationCount >= 3) {
//     throw new Error("You have reached the maximum application limit!");
//   }

//   return prisma.sellerApplication.create({
//     data: {
//       userId,
//       reason,
//     },
//   });
// };

export const sellerService = {
  applyForSeller,
};
