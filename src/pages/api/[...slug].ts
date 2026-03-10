import { Elysia } from "elysia";
import type { APIRoute } from "astro";
import { openapi } from "@elysiajs/openapi";
import { AuthRoutes } from "../../backend/auth/auth.routes";
import { AppError } from "../../backend/errors/AppError";
import { ValidationError } from "elysia";
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
    .use(AuthRoutes())
    .onError(({ error, set }) => {
      console.log(error);

      if (error instanceof AppError) {
        set.status = error.statusCode;
        return {
          error: error.errorName,
          errorCode: error.errorCode,
          message: error.message,
        };
      }

      if (error instanceof ValidationError) {
        set.status = 400;

        return {
          error: "VALIDATION_ERROR",
          errorCode: 1014,
          message: error.valueError?.message || "Invalid request body",
        };
      }

      // Fallback
      set.status = 500;
      return {
        error: "InternalServerError",
        errorCode: 1013,
        message: "An unexpected error occurred",
      };
    });

  return await app.handle(ctx.request);
};

export const ALL: APIRoute = handle;
