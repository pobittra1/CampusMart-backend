import { prisma } from "../lib/prisma";

const seedAdmin = async () => {
  const admin = await prisma.user.update({
    where: {
      email: process.env.ADMIN_EMAIL!,
    },
    data: {
      role: "ADMIN",
    },
  });

  console.log(`Admin created successfully: ${admin.email}`);
};

seedAdmin()
  .catch((error) => {
    console.error("Failed to create admin:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
