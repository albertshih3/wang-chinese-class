import { getTranslations } from "next-intl/server";

export async function SiteFooter({ siteName = "Wang Laoshi" }: { siteName?: string }) {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-heading text-sm font-medium text-foreground">{siteName}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("tagline")}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          © {year} {siteName}. {t("copyright")}
        </p>
      </div>
    </footer>
  );
}
