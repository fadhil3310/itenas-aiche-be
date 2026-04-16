import { PublishStatus } from "@backend/generated/prisma/enums";
import { NewsPlain } from "@backend/generated/prismabox/News";
import { UserPlain } from "@backend/generated/prismabox/User";
import { t } from "elysia";

const StandardResponse = t.Object({
  ...NewsPlain.properties,
  user: t.Object({
    ...(t.Pick(UserPlain, ['name']).properties)
  }),
});

const Model = {
  getAllQuery: t.Object({
    title: t.Optional(t.String()),
    status: t.Optional(t.Enum(PublishStatus)),
  }),
  getAllResponse: t.Object({ data: t.Array(StandardResponse) }),

  getIdParams: t.Object({ id: t.Number() }),
  getIdResponse: t.Object({ data: t.Nullable(StandardResponse) }),

  postBody: t.Object({
    title: t.String({ minLength: 1 }),
    image: t.File({
      type: ["image/png", "image/jpeg", "image/avif", "image/webp"],
    }),
    content: t.String({ minLength: 1 }),
    summary: t.String({ minLength: 1 }),
    status: t.Enum(PublishStatus),
  }),
  postResponse: t.Object({
    id: t.Number({ description: "The id of the created news" }),
  }),

  deleteIdParams: t.Object({ id: t.Number() }),
  deleteIdMessage: { 204: t.Undefined() },
};

export const NewsAdminModel = {
  StandardResponse,
  Model,
};
