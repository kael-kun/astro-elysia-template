import Elysia, { t } from "elysia";
import { typedEnv } from "../types/elysia";
import { createAuthController } from "./auth.controller";
import { verifyRefreshToken } from "./auth.utils";
import { rateLimiter } from "../ratelimit/rate-limiter";
export function AuthRoutes() {
  const app = new Elysia({ prefix: "/auth" })
    .use(typedEnv)
    .use(rateLimiter())
    .post(
      "/register",
      async ({ body, env }) => {
        const authController = createAuthController(env);
        const result = await authController.register({
          email: body.email,
          password: body.password,
          name: body.name,
        });
        return { user: result.user };
      },
      {
        body: t.Object({
          email: t.String({ maxLength: 255, format: "email" }),
          password: t.String({ maxLength: 255 }),
          name: t.String({ maxLength: 255 }),
        }),
      },
    )
    .post(
      "/login",
      async ({ body, env, set }) => {
        const authController = createAuthController(env);
        const result = await authController.login(body.email, body.password);
        set.headers["Authorization"] = `Bearer ${result.accessToken}`;
        set.cookie = {
          refreshToken: {
            value: result.refreshToken,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
          },
        };
        return { accessToken: result.accessToken };
      },
      {
        body: t.Object({
          email: t.String({ maxLength: 255, format: "email" }),
          password: t.String({ maxLength: 255 }),
        }),
      },
    )
    .post("/refresh", async ({ env, cookie }) => {
      const authController = createAuthController(env);
      const refreshToken = cookie.refreshToken?.value as string;
      if (!refreshToken) {
        throw new Error("Refresh token not found");
      }
      const result = await authController.refresh(refreshToken);
      return { accessToken: result.accessToken };
    })
    .post("/logout", async ({ env, cookie }) => {
      const authController = createAuthController(env);
      const refreshToken = cookie.refreshToken?.value as string;

      if (refreshToken) {
        const decoded = await verifyRefreshToken(refreshToken, env.JWT_REFRESH_SECRET);
        if (decoded) {
          await authController.logout(decoded.sid);
        }
      }

      cookie.refreshToken.remove();
      return { success: true };
    });
  return app;
}
