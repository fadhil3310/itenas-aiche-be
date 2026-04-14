import { Elysia } from "elysia";
import * as z from "zod";
import { authMiddleware } from "../middlewares/auth";
import { authClient } from "@backend/src/lib/auth-client";
import { logger } from "@backend/src/lib/logger";

export const devRoutes = new Elysia({ prefix: "/dev" })
  .use(authMiddleware)
  .post(
    "/sign-up",
    async ({ body, status }) => {
      const { email, password, name } = body;
      logger.debug("Got message internal sign-up", body);

      const { data, error } = await authClient.signUp.email(
        {
          email, // user email address
          password, // user password -> min 8 characters by default
          name, // user display name
          // image, // User image URL (optional)
          // callbackURL: "/dashboard", // A URL to redirect to after the user verifies their email (optional)
        },
        {
          onRequest: (ctx) => {},
          onSuccess: (ctx) => {},
          onError: (ctx) => {
            // return status(500);
          },
        },
      );

      if (error) throw error;

      return {
        message: "Account created successfully",
      };
    },
    {
      body: z.object({
        email: z.email(),
        name: z.string().min(1),
        password: z.string().min(8),
      }),
      detail: {
        summary: "Create an account (only available in development)",
        tags: ['Admin']
      },
    },
  );
