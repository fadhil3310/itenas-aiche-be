import Elysia from "elysia";
import { newsRoutes } from "./news";
import { authMiddleware } from "../../middlewares/auth";

export const adminRoutes = new Elysia({ prefix: "/admin" })
  .use(authMiddleware)
  .guard({
    auth: true
  })
  .use(newsRoutes);
