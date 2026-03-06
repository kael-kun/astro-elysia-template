import { Elysia } from "elysia";
import type { APIRoute } from "astro";
import { openapi } from "@elysiajs/openapi";

const handle: APIRoute = async (ctx) => {
  const app = new Elysia({
    prefix: "/api",
    aot: false,
  })
    .use(openapi())
    .get("/hello", () => ({ message: "Hello from Elysia!" }));

  return await app.handle(ctx.request);
};

export const ALL: APIRoute = handle;
