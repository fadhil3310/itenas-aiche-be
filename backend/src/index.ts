import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { configure, getConsoleSink } from "@logtape/logtape";
import { elysiaLogger } from "@logtape/elysia";
import { fromTypes, openapi } from "@elysiajs/openapi";

import { authMiddleware } from "./middlewares/auth";
import { adminRoutes } from "./controllers/admin";
import { frontRoutes } from "./controllers/front";
import { devRoutes } from "./controllers/dev";
import staticPlugin from "@elysiajs/static";

await configure({
  sinks: { console: getConsoleSink() },
  loggers: [
    { category: ["elysia"], sinks: ["console"], lowestLevel: "info" },
    { category: ["aiche"], sinks: ["console"], lowestLevel: "debug" },
  ],
});

const app = new Elysia({
  prefix: "/api",
})
  .use(elysiaLogger())
  .use(
    openapi({
      references: fromTypes(),
      documentation: {
        info: {
          title: "AICHE ITENAS",
          version: "0.0.1",
        },
        tags: [
          { name: "Admin", description: "API Only for Admin" },
          { name: "Front", description: "Front-facing API" },
        ],
      },
    }),
  )
  .use(
    cors({
      origin: "http://localhost:5420",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(staticPlugin())
  .use(authMiddleware)
  .use(adminRoutes)
  .use(frontRoutes)
  .use(devRoutes)
  .listen(5419);

console.log(`Server is running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;