import Elysia from "elysia";
import { authServer } from "@backend/src/lib/auth-server";

export const authMiddleware = new Elysia({ name: "better-auth" })
  .mount(authServer.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await authServer.api.getSession({
          headers,
        });

        if (!session) return status(401);

        return {
          user: session.user,
          session: session.session,
        };
      },
    },
  });
