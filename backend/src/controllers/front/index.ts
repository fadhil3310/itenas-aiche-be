import Elysia from "elysia";
import { newsRoutes } from "./news";

export const frontRoutes = new Elysia()
  .use(newsRoutes);
