import { Elysia } from "elysia";
import { logger } from "@backend/src/lib/logger";
import { prisma } from "@backend/src/lib/db";
import { authMiddleware } from "@backend/src/middlewares/auth";
import { deleteFile, storeImage } from "@backend/src/services/storage";
import { AboutUsAdmin } from "./model";

const STORAGE_CATEGORY = "about-us";

export const aboutUsRoutes = new Elysia({ prefix: "/aboutUs" })
  .use(authMiddleware)
  .guard({
    auth: true,
  })

  // ============================================
  // Regular ------------------------------------
  // ============================================

  // Get all About Us Category
  .get(
    "/",
    async ({}) => {
      const data = await prisma.aboutUs.findMany({
        include: { category: true },
      });
      return { data };
    },
    {
      response: AboutUsAdmin.Model.getAllResponse,
      detail: {
        summary: "Get all About Us",
        tags: ["Admin"],
      },
    },
  )

  // Get About Us Category based on its id
  .get(
    "/id/:id",
    async ({ params: { id } }) => {
      const data = await prisma.aboutUs.findUnique({
        where: { id },
        include: { category: true },
      });
      return { data };
    },
    {
      params: AboutUsAdmin.Model.getByIdParams,
      response: AboutUsAdmin.Model.getByIdResponse,
      detail: {
        summary: "Get About Us based on its id",
        tags: ["Admin"],
      },
    },
  )

  // Create About Us Category
  .post(
    "/",
    async ({ body }) => {
      const { title, image, content, categoryId } = body;
      const imageFileName = await storeImage(image, STORAGE_CATEGORY);

      const data = await prisma.aboutUs.create({
        data: {
          title,
          image: imageFileName,
          content,
          categoryId,
        },
      });
      return { id: data.id };
    },
    {
      body: AboutUsAdmin.Model.postBody,
      response: AboutUsAdmin.Model.postResponse,
      parse: "multipart/form-data",
      detail: {
        summary: "Create About Us",
        tags: ["Admin"],
      },
    },
  )

  // Delete About Us based on its id
  .delete(
    "/id/:id",
    async ({ params: { id }, status }) => {
      const data = await prisma.aboutUs.delete({
        where: { id },
      });
      deleteFile(data.image);
      return status(204, undefined);
    },
    {
      params: AboutUsAdmin.Model.deleteByIdParams,
      response: AboutUsAdmin.Model.deleteByIdResponse,
      detail: {
        summary: "Delete About Us based on its id",
        tags: ["Admin"],
      },
    },
  )

  // ==============================================
  // Category -------------------------------------
  // ==============================================

  // Get all About Us Category
  .get(
    "/category",
    async ({}) => {
      const data = await prisma.aboutUsCategory.findMany();
      return { data };
    },
    {
      response: AboutUsAdmin.Model.getCategoryAllResponse,
      detail: {
        summary: "Get all About Us Category",
        tags: ["Admin"],
      },
    },
  )

  // Get About Us Category based on its id
  .get(
    "/category/id/:id",
    async ({ params: { id } }) => {
      const data = await prisma.aboutUsCategory.findUnique({
        where: { id },
      });
      return { data };
    },
    {
      params: AboutUsAdmin.Model.getCategoryByIdParams,
      response: AboutUsAdmin.Model.getCategoryByIdResponse,
      detail: {
        summary: "Get About Us Category based on its id",
        tags: ["Admin"],
      },
    },
  )

  // Create About Us Category
  .post(
    "/category",
    async ({ body }) => {
      const { name } = body;

      const data = await prisma.aboutUsCategory.create({
        data: { name },
      });
      return { id: data.id };
    },
    {
      body: AboutUsAdmin.Model.postCategoryBody,
      response: AboutUsAdmin.Model.postCategoryResponse,
      detail: {
        summary: "Create About Us Category",
        tags: ["Admin"],
      },
    },
  )

  // Delete About Us Category based on its id
  .delete(
    "/category/id/:id",
    async ({ params: { id }, status }) => {
      const relationsExist =
        (await prisma.aboutUs.findFirst({
          where: { categoryId: id },
        })) != undefined;
      console.log();
      if (relationsExist) {
        throw status(400, {
          detail:
            "Kategori masih dipakai dalam salah satu About Us, silahkan hapus dulu",
        });
      }

      await prisma.aboutUsCategory.delete({
        where: { id },
      });
      return status(204, undefined);
    },
    {
      params: AboutUsAdmin.Model.deleteCategoryByIdParams,
      response: AboutUsAdmin.Model.deleteCategoryByIdResponse,
      detail: {
        summary: "Delete About Us Category based on its id",
        tags: ["Admin"],
      },
    },
  );
