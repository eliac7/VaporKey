import { redis } from "@/lib/redis";
import { Elysia, t } from "elysia";
import { nanoid } from "nanoid";

const SECRET_TTL_SECONDS = 86400;

const secretRoutes = new Elysia({ prefix: "/secret" })
  .get(
    "/retrieve",
    async ({ query, set }) => {
      const { id } = query;

      const data = await redis.getdel(`secret:${id}`);

      if (!data) {
        set.status = 404;
        return { error: "Secret not found or already destroyed" };
      }

      let secret = "";
      let language = "text";

      const typedData = data as { secret: string; language?: string };
      secret = typedData.secret;
      language = typedData.language ?? "text";

      return { secret, language };
    },
    {
      query: t.Object({
        id: t.String(),
      }),
    }
  )
  .post(
    "/create",
    async ({ body }) => {
      //Generate short id
      const id = nanoid(10);

      const payload = JSON.stringify({
        secret: body.secret,
        language: body.language || "text",
      });

      await redis.set(`secret:${id}`, payload, { ex: SECRET_TTL_SECONDS });

      return { id };
    },
    {
      body: t.Object({
        secret: t.String(),
        language: t.Optional(t.String()),
      }),
    }
  );

const app = new Elysia({ prefix: "/api" }).use(secretRoutes);

export type App = typeof app;

export const GET = app.fetch;
export const POST = app.fetch;
