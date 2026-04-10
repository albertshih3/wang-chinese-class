import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ClerkProvider } from "@clerk/nextjs";
import { cache } from "react";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { sanityFetch } from "@/lib/sanity";
import { cn } from "@/lib/utils";

const lora = Lora({ subsets: ["latin"], variable: "--font-serif" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{ siteName, zoomLink, googleClassroomUrl }`;

interface SiteSettings {
  siteName: string | null;
  zoomLink: string | null;
  googleClassroomUrl: string | null;
}

// Memoize per-request so generateMetadata and the layout render share one fetch
const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  try {
    return await sanityFetch<SiteSettings>(SITE_SETTINGS_QUERY);
  } catch {
    return null;
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings?.siteName ?? "Wang Laoshi";

  return {
    title: {
      default: `${siteName} — Mandarin Chinese Classes`,
      template: `%s | ${siteName}`,
    },
    description:
      "Small-group Mandarin Chinese classes for K–5 learners. Warm community, experienced teacher.",
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
    ],
  };
}

type Locale = (typeof routing.locales)[number];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const [messages, settings] = await Promise.all([
    getMessages(),
    getSiteSettings(),
  ]);

  const siteName = settings?.siteName ?? "Wang Laoshi";

  return (
    <ClerkProvider
      afterSignOutUrl="/"
      signInUrl="/sign-in"
      signInFallbackRedirectUrl="/classes"
    >
      <html
        lang={locale}
        className={cn(
          "h-full antialiased",
          geistSans.variable,
          geistMono.variable,
          lora.variable
        )}
        style={{ colorScheme: "light dark" }}
        suppressHydrationWarning
      >
        <body className="flex min-h-full flex-col bg-background text-foreground font-sans" suppressHydrationWarning>
          <NextIntlClientProvider messages={messages}>
            <AnnouncementBanner />
            <SiteHeader siteName={siteName} />
            <main className="flex-1">{children}</main>
            <SiteFooter siteName={siteName} />
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
