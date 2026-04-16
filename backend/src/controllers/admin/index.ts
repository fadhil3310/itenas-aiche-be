import Elysia from "elysia";
import { newsRoutes } from "./news";
import { aboutUsRoutes } from "./aboutUs";

export const adminRoutes = new Elysia({ prefix: "/admin" })
  .use(aboutUsRoutes)
  .use(newsRoutes);
