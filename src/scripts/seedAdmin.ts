import { prisma } from "../lib/prisma";
import { userRole } from "../types/auth";

const seedAdmin = async () => {
  const adminData = {
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    role: userRole.ADMIN,
    phone: process.env.ADMIN_PHONE,
    password: process.env.ADMIN_PASS,
  };

  // Check user exist on db or not
  const existingUser = await prisma.user.findUnique({
    where: {
      email: adminData.email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists!");
  }

  // Create admin using Better Auth
  const signUpAdmin = await fetch(
    "http://localhost:5000/api/auth/sign-up/email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:4000",
      },
      body: JSON.stringify(adminData),
    },
  );

  if (!signUpAdmin.ok) {
    const error = await signUpAdmin.text();
    throw new Error(
      `Admin signup failed! Status: ${signUpAdmin.status}, Error: ${error}`,
    );
  }

  // Update admin emailVerified and role
  await prisma.user.update({
    where: {
      email: adminData.email,
    },
    data: {
      emailVerified: true,
      role: userRole.ADMIN,
    },
  });

  console.log(`Admin created successfully: ${adminData.email}`);
};

seedAdmin()
  .catch((error) => {
    console.error("Failed to create admin:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
