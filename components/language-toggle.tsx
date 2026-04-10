"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LOCALES = [
  { value: "en", label: "English" },
  { value: "zh-TW", label: "繁體中文" },
  { value: "zh-CN", label: "简体中文" },
] as const;

type LocaleValue = (typeof LOCALES)[number]["value"];

interface LanguageToggleProps {
  /** Render as a full-width list of items instead of a dropdown trigger */
  inline?: boolean;
}

export function LanguageToggle({ inline = false }: LanguageToggleProps) {
  const t = useTranslations("nav");
  const locale = useLocale() as LocaleValue;
  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = (next: LocaleValue) => {
    router.replace(pathname, { locale: next });
  };

  if (inline) {
    return (
      <div className="flex flex-col gap-1 pt-1">
        <p className="px-3 pb-1 font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
          {t("languageLabel")}
        </p>
        {LOCALES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            className={cn(
              "rounded-md px-3 py-2 text-left text-sm transition-colors",
              value === locale
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }

  const currentLabel = LOCALES.find((l) => l.value === locale)?.label ?? "EN";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          aria-label={t("languageLabel")}
        >
          <Globe className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">{currentLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map(({ value, label }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => handleSelect(value)}
            className={cn(value === locale && "font-medium text-primary")}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
