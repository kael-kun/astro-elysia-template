import { defineMiddleware } from "astro/middleware";

const PROTECTED_ROUTES = ["/chat"];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  const pathname = url.pathname;

  const token = cookies.get("refreshToken")?.value;

  const isLoginPage = pathname === "/auth/login";
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (isLoginPage && token) {
    return redirect("/chat", 302);
  }

  if (isProtectedRoute && !token) {
    return redirect("/auth/login", 302);
  }

  return next();
});
