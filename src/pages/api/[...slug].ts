import { Elysia } from "elysia";
import type { APIRoute } from "astro";
import { openapi } from "@elysiajs/openapi";
import { AuthRoutes } from "../../backend/auth/auth.routes";
const handle: APIRoute = async (ctx) => {
  const app = new Elysia({
    prefix: "/api",
    aot: false,
  })
    .decorate({
      env: ctx.locals.runtime.env,
      urlData: ctx.url,
      astroCookies: ctx.cookies,
    })
    .use(openapi())
    .use(AuthRoutes());

  return await app.handle(ctx.request);
};

export const ALL: APIRoute = handle;
