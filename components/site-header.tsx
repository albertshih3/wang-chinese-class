"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "@/components/language-toggle";

export function SiteHeader({ siteName = "Wang Laoshi" }: { siteName?: string }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isSignedIn, sessionClaims } = useAuth();
  const isAdmin = (sessionClaims?.metadata as { role?: string } | undefined)?.role === "admin";

  const publicNavLinks = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/faq", label: t("faq") },
    { href: "/contact", label: t("contact") },
  ];

  const allNavLinks = isSignedIn
    ? [...publicNavLinks, { href: "/classes", label: t("classes") }]
    : publicNavLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo lockup */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-heading text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
          aria-label={`${siteName} — Home`}
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold select-none"
            aria-hidden="true"
          >
            學
          </span>
          <span>{siteName}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {allNavLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-all duration-200",
                pathname === href
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {label}
            </Link>
          ))}

          <LanguageToggle />

          {isSignedIn ? (
            <div className="ml-1">
              <UserButton>
                {isAdmin && (
                  <UserButton.UserProfileLink
                    label="Content Studio"
                    url="/studio"
                    labelIcon={<LayoutDashboard className="size-4" />}
                  />
                )}
              </UserButton>
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="ml-1 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:text-foreground"
            >
              {t("signIn")}
            </Link>
          )}
        </nav>

        {/* Mobile: language toggle + menu button */}
        <div className="flex items-center gap-1 md:hidden">
          <LanguageToggle />
          <button
            className="flex items-center justify-center rounded-md p-2 text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <div className="border-t border-border/60 bg-background px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {allNavLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                aria-current={pathname === href ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm transition-all duration-200",
                  pathname === href
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {label}
              </Link>
            ))}

            {isSignedIn ? (
              <div className="mt-2 flex items-center gap-3 px-3 py-2">
                <UserButton>
                  {isAdmin && (
                    <UserButton.UserProfileLink
                      label="Content Studio"
                      url="/studio"
                      labelIcon={<LayoutDashboard className="size-4" />}
                    />
                  )}
                </UserButton>
                <span className="font-sans text-sm text-muted-foreground">
                  {t("myAccount")}
                </span>
              </div>
            ) : (
              <Link
                href="/sign-in"
                onClick={() => setMenuOpen(false)}
                className="mt-1 rounded-md border border-border px-3 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:text-foreground"
              >
                {t("signIn")}
              </Link>
            )}

            <LanguageToggle inline />
          </nav>
        </div>
      )}
    </header>
  );
}
