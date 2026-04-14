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

      const news = await prisma.news.findMany({
        where: { title: { startsWith: title }, status: publishStatus },
      });
      return { news };
    },
    {
      query: NewsModel.getAllQuery,
      response: NewsModel.getAllResponse,
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
      const news = await prisma.news.findUnique({
        where: { id },
      });
      return { news };
    },
    {
      params: NewsModel.getIdParams,
      response: NewsModel.getIdResponse,
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
        message: "News successfully created.",
        id: news.id,
      };
    },
    {
      body: NewsModel.postBody,
      response: NewsModel.postResponse,
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
    async ({ params: { id } }) => {
      const news = await prisma.news.delete({
        where: { id },
      });

      deleteFile(news.image);

      return { message: "News successfully deleted." };
    },
    {
      params: NewsModel.deleteIdParams,
      response: NewsModel.deleteIdMessage,
      detail: {
        summary: "Delete News based on its id",
        tags: ["Admin"],
      },
    },
  );
