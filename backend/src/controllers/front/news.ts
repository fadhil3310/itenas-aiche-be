import { Elysia, t } from "elysia";
import { logger } from "@backend/src/lib/logger";
import { prisma } from "@backend/src/lib/db";
import { PublishStatus } from "@backend/generated/prisma/enums";
import { NewsPlain } from "@backend/generated/prismabox/News";

export const newsRoutes = new Elysia({ prefix: "/news" })
  .get(
    "/",
    async () => {
      const news = await prisma.news.findMany({
        where: { status: PublishStatus.PUBLISHED },
      });
      return { news };
    },
    {
      response: t.Object({ news: t.Array(NewsPlain) }),
      detail: {
        summary: "Get all published News",
        tags: ["Front"],
      },
    },
  )
  .get(
    "/id/:id",
    async ({ params: { id } }) => {
      const news = await prisma.news.findUnique({
        where: { id, status: PublishStatus.PUBLISHED },
      });
      return { news };
    },
    {
      params: t.Object({ id: t.Number() }),
      response: t.Object({ news: t.Nullable(NewsPlain) }),
      detail: {
        summary: "Get published News based on its id",
        tags: ["Front"],
      },
    },
  );
