import { prisma } from "../../lib/prisma";

const getSellerApplications = async () => {
  return await prisma.sellerApplication.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const approveSeller = async (applicationId: string) => {
  return await prisma.$transaction(async (tx) => {
    const application = await tx.sellerApplication.findUnique({
      where: { id: applicationId },
      include: { user: true },
    });

    if (!application) {
      throw new Error("Seller application not found");
    }

    if (application.status !== "PENDING") {
      throw new Error("This application has already been processed");
    }

    if (application.user.role !== "BUYER") {
      throw new Error("This user is not a buyer");
    }

    // Prevent two admins from approving the same application
    const updatedApplication = await tx.sellerApplication.updateMany({
      where: {
        id: applicationId,
        status: "PENDING",
      },
      data: {
        status: "APPROVED",
      },
    });

    if (updatedApplication.count === 0) {
      throw new Error("This application has already been processed");
    }

    // Change BUYER role to SELLER
    await tx.user.update({
      where: { id: application.userId },
      data: {
        role: "SELLER",
      },
    });

    return await tx.sellerApplication.findUnique({
      where: { id: applicationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  });
};

const rejectSeller = async (applicationId: string) => {
  const result = await prisma.sellerApplication.updateMany({
    where: {
      id: applicationId,
      status: "PENDING",
    },
    data: {
      status: "REJECTED",
    },
  });

  if (result.count === 0) {
    throw new Error("Application not found or already processed");
  }

  return await prisma.sellerApplication.findUnique({
    where: { id: applicationId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

export const adminService = {
  getSellerApplications,
  approveSeller,
  rejectSeller,
};
