import { Elysia } from "elysia";
import { logger } from "@backend/src/lib/logger";
import { prisma } from "@backend/src/lib/db";
import { authMiddleware } from "@backend/src/middlewares/auth";
import { deleteFile, storeImage } from "@backend/src/services/storage";
import { NewsAdminModel } from "./model";

const STORAGE_CATEGORY = "news";

export const newsRoutes = new Elysia({ prefix: "/news" })
  .use(authMiddleware)
  .guard({
    auth: true,
  })

  // Get all News
  .get(
    "/",
    async ({ query }) => {
      const { title, status: publishStatus } = query;

      const data = await prisma.news.findMany({
        where: { title: { startsWith: title }, status: publishStatus },
        include: {
          user: {
            select: { name: true },
          },
        },
      });
      return { data };
    },
    {
      query: NewsAdminModel.Model.getAllQuery,
      response: NewsAdminModel.Model.getAllResponse,
      detail: {
        summary: "Get all News",
        tags: ["Admin"],
      },
    },
  )

  // Get News based on its id
  .get(
    "/id/:id",
    async ({ params: { id } }) => {
      const data = await prisma.news.findUnique({
        where: { id },
        include: {
          user: {
            select: { name: true },
          },
        },
      });
      return { data };
    },
    {
      params: NewsAdminModel.Model.getIdParams,
      response: NewsAdminModel.Model.getIdResponse,
      detail: {
        summary: "Get News based on its id",
        tags: ["Admin"],
      },
    },
  )

  // Create News
  .post(
    "/",
    async ({ body, user }) => {
      const { title, image, content, summary, status } = body;
      const authorId = user.id;
      const imageFileName = await storeImage(image, STORAGE_CATEGORY);

      const news = await prisma.news.create({
        data: {
          title,
          authorId,
          image: imageFileName,
          content,
          summary,
          status,
        },
      });
      return {
        id: news.id,
      };
    },
    {
      body: NewsAdminModel.Model.postBody,
      response: NewsAdminModel.Model.postResponse,
      parse: "multipart/form-data",
      detail: {
        summary: "Create News",
        tags: ["Admin"],
      },
    },
  )

  // Delete News based on its id
  .delete(
    "/id/:id",
    async ({ params: { id }, status }) => {
      const news = await prisma.news.delete({
        where: { id },
      });
      deleteFile(news.image);
      return status(204, undefined);
    },
    {
      params: NewsAdminModel.Model.deleteIdParams,
      response: NewsAdminModel.Model.deleteIdMessage,
      detail: {
        summary: "Delete News based on its id",
        tags: ["Admin"],
      },
    },
  );
