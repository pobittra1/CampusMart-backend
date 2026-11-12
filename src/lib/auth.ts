import { prisma } from "./prisma";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    usePlural: false,
  }),
  trustedOrigins: [process.env.APP_URL!],
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
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

        const info = await transporter.sendMail({
          from: `"CampusMart" <${process.env.APP_USER}>`,
          to: user.email,
          subject: "Verify Your Email - CampusMart",

          text: `Welcome to CampusMart!

Please verify your email address by clicking the link below:

${verificationUrl}

If you did not create an account, you can ignore this email.`,

          html: `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 10px;">

      <h2 style="color: #16a34a; text-align: center;">
        Welcome to CampusMart!
      </h2>

      <p style="color: #374151; font-size: 15px;">
        Hi ${user.name || "there"},
      </p>

      <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
        Thanks for creating an account with CampusMart.
        Please verify your email address to activate your account.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a
          href="${verificationUrl}"
          style="background-color: #16a34a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold;"
        >
          Verify Email
        </a>
      </div>

      <p style="color: #6b7280; font-size: 13px;">
        If the button doesn't work, copy and paste this link into your browser:
      </p>

      <a href="${verificationUrl}" style="color: #16a34a; font-size: 13px; word-break: break-all;">
        ${verificationUrl}
      </a>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />

      <p style="color: #9ca3af; font-size: 12px; text-align: center;">
        If you didn't create an account, you can safely ignore this email.
      </p>

      <p style="color: #6b7280; font-size: 13px; text-align: center;">
        © 2026 CampusMart. All rights reserved.
      </p>

    </div>
  `,
        });

        console.log("Message sent: %s", info.messageId);
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
});
