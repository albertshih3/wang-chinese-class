const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? "Wang Laoshi";

export function SiteFooter() {
  // Computed inside the function so it reflects the actual request year,
  // not the build-time year baked into static HTML.
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-heading text-sm font-medium text-foreground">{SITE_NAME}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Mandarin Chinese classes for K–5 learners.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          © {year} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
