import Elysia from "elysia";
import { typedEnv } from "../types/elysia";

export function AuthRoutes() {
  const app = new Elysia();
  app.use(typedEnv).get("/test", async ({ env }) => {
    const Environment = env.ENV;
    return Environment;
  });

  return app;
}
