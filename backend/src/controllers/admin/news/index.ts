import { Elysia } from "elysia";
import { logger } from "@backend/src/lib/logger";
import { prisma } from "@backend/src/lib/db";
import { authMiddleware } from "@backend/src/middlewares/auth";
import { deleteFile, storeImage } from "@backend/src/services/storage";
import { NewsModel } from "./model";

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
      });
      return { data };
    },
    {
      query: NewsModel.Model.getAllQuery,
      response: NewsModel.Model.getAllResponse,
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
      });
      return { data };
    },
    {
      params: NewsModel.Model.getIdParams,
      response: NewsModel.Model.getIdResponse,
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
      const { title, image, content, status } = body;
      const authorId = user.id;
      const imageFileName = await storeImage(image, STORAGE_CATEGORY);

      const news = await prisma.news.create({
        data: {
          title,
          authorId,
          image: imageFileName,
          content,
          status,
        },
      });
      return {
        id: news.id,
      };
    },
    {
      body: NewsModel.Model.postBody,
      response: NewsModel.Model.postResponse,
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
      params: NewsModel.Model.deleteIdParams,
      response: NewsModel.Model.deleteIdMessage,
      detail: {
        summary: "Delete News based on its id",
        tags: ["Admin"],
      },
    },
  );
