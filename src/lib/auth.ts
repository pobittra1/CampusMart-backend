import { prisma } from "./prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    usePlural: false,
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "BUYER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});
