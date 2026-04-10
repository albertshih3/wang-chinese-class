import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Matches /classes and /{locale}/classes for all non-default locales
const isProtectedRoute = createRouteMatcher([
  "/classes(.*)",
  "/(zh-TW|zh-CN)/classes(.*)",
]);

// Studio is handled by its own layout — skip intl for this route
const isStudioRoute = createRouteMatcher(["/studio(.*)"]);

// API routes have no locale prefix and must not pass through intlMiddleware
const isApiRoute = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isStudioRoute(req) || isApiRoute(req)) {
    return NextResponse.next();
  }
  if (isProtectedRoute(req)) await auth.protect();
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
