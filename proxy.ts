import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16: middleware is now called "proxy" — file must be proxy.ts
export const proxy = createMiddleware(routing);

export const config = {
  // Match all pathnames except Next.js internals and static files.
  // The default locale (en) has no prefix, so the single pattern covers all routes.
  matcher: ["/((?!_next|_vercel|.*\\..*).*)", "/api/consultation"],
};
