import { AboutUsPlain } from "@backend/generated/prismabox/AboutUs";
import { AboutUsCategoryPlain } from "@backend/generated/prismabox/AboutUsCategory";
import { t } from "elysia";

const CategoryStandardReponse = AboutUsCategoryPlain;
// AHHHH Typebox i love you, now i have to write this spaghetti code just to circumvent 
// any errors typescript thrown at me which are caused by YOU.
// why my coding journey so miserable
const StandardResponse = t.Object({
  ...AboutUsPlain.properties,
  category: t.Object({
    ...CategoryStandardReponse.properties,
  }),
});

const Model = {
  // Regular ------------------------------------

  getAllResponse: t.Object({ data: t.Array(StandardResponse) }),

  getByIdParams: t.Object({ id: t.Number() }),
  getByIdResponse: t.Object({ data: t.Nullable(StandardResponse) }),

  postBody: t.Object({
    title: t.String({ minLength: 1 }),
    image: t.File({
      type: ["image/png", "image/jpeg", "image/avif", "image/webp"],
    }),
    content: t.String(),
    categoryId: t.Numeric(),
  }),
  postResponse: t.Object({
    id: t.Number({ description: "The id of the created About Us card" }),
  }),

  deleteByIdParams: t.Object({ id: t.Number() }),
  deleteByIdResponse: { 204: t.Undefined() },

  // Category -------------------------------------

  getCategoryAllResponse: t.Object({ data: t.Array(CategoryStandardReponse) }),

  getCategoryByIdParams: t.Object({ id: t.Number() }),
  getCategoryByIdResponse: t.Object({
    data: t.Nullable(CategoryStandardReponse),
  }),

  postCategoryBody: t.Object({
    name: t.String({ minLength: 1 }),
  }),
  postCategoryResponse: t.Object({
    id: t.Number({ description: "The id of the created About Us card" }),
  }),

  deleteCategoryByIdParams: t.Object({ id: t.Number() }),
  deleteCategoryByIdResponse: {
    204: t.Undefined(),
    400: t.Object({ detail: t.String() }),
  },
};

export const AboutUsAdmin = {
  StandardResponse,
  CategoryStandardReponse,
  Model,
};
