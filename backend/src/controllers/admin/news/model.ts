import { PublishStatus } from "@backend/generated/prisma/enums";
import { NewsPlain } from "@backend/generated/prismabox/News";
import { t } from "elysia";

export const NewsModelStandardResponse = NewsPlain;

export const NewsModel = {
  getAllQuery: t.Object({
    title: t.Optional(t.String()),
    status: t.Optional(t.Enum(PublishStatus)),
  }),
  getAllResponse: t.Object({ news: t.Array(NewsModelStandardResponse) }),

  getIdParams: t.Object({ id: t.Number() }),
  getIdResponse: t.Object({ news: t.Nullable(NewsModelStandardResponse) }),

  postBody: t.Object({
    title: t.String({ minLength: 1 }),
    image: t.File({
      type: ["image/png", "image/jpeg", "image/avif", "image/webp"],
    }),
    content: t.String(),
    status: t.Enum(PublishStatus),
  }),
  postResponse: t.Object({
    message: t.String(),
    id: t.Number({ description: "The id of the created news" }),
  }),

  deleteIdParams: t.Object({ id: t.Number() }),
  deleteIdMessage: t.Object({ message: t.String() }),
};

export type NewsModelType = {
    standardResponse: typeof NewsModelStandardResponse.static,

    getAllQuery: typeof NewsModel.getAllQuery.static,
    getAllResponse: typeof NewsModel.getAllResponse.static,

    getIdParams: typeof NewsModel.getIdParams.static,
    getIdResponse: typeof NewsModel.getIdResponse.static,

    createBody: typeof NewsModel.postBody.static,
    createResponse: typeof NewsModel.postResponse.static,
};
