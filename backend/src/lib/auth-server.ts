import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { openAPI } from "better-auth/plugins";

export const authServer = betterAuth({
  basePath: "/admin/auth",
  trustedOrigins: ["http://localhost:5420"],
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    openAPI()
  ]
});
