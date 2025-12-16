import { redis } from "@/lib/redis";
import { Elysia, t } from "elysia";
import { nanoid } from "nanoid";

const SECRET_TTL_SECONDS = 86400;

const secretRoutes = new Elysia({ prefix: "/secret" })
  .get(
    "/retrieve",
    async ({ query, set }) => {
      const { id } = query;

      const encryptedData = await redis.getdel(`secret:${id}`);

      if (!encryptedData) {
        set.status = 404;
        return { error: "Secret not found or already destroyed" };
      }

      return { encryptedData: String(encryptedData) };
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
      const id = nanoid(10);

      await redis.set(`secret:${id}`, body.encryptedData, {
        ex: SECRET_TTL_SECONDS,
      });

      return { id };
    },
    {
      body: t.Object({
        encryptedData: t.String(),
      }),
    }
  );
const app = new Elysia({ prefix: "/api" }).use(secretRoutes);

export type App = typeof app;

export const GET = app.fetch;
export const POST = app.fetch;
