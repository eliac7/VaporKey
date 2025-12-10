import { redis } from "@/lib/redis";
import { Elysia, t } from "elysia";

const secretRoutes = new Elysia({ prefix: "/secret" }).get(
  "/retrieve",
  async ({ query, set }) => {
    const { id } = query;

    const secret = await redis.getdel(`secret:${id}`);

    if (!secret) {
      set.status = 404;
      return { error: "Secret not found or already destroyed" };
    }
    
    return { secret };
  },
  {
    query: t.Object({
      id: t.String(),
    }),
  }
);

const app = new Elysia({ prefix: "/api" }).use(secretRoutes);

export type App = typeof app;

export const GET = app.fetch;
export const POST = app.fetch;
