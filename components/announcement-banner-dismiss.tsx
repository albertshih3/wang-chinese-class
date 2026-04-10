"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Severity = "info" | "warning" | "success";

interface Banner {
  _id: string;
  message: string;
  severity: Severity;
}

const severityClasses: Record<Severity, string> = {
  info: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-100",
  warning:
    "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-100",
  success:
    "bg-green-50 border-green-200 text-green-900 dark:bg-green-950/40 dark:border-green-800 dark:text-green-100",
};

export function AnnouncementBannerList({ banners }: { banners: Banner[] }) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const stored = banners
      .map((b) => b._id)
      .filter((id) => sessionStorage.getItem(`banner-dismissed-${id}`) === "1");
    if (stored.length > 0) setDismissed(new Set(stored));
  }, [banners]);

  function dismiss(id: string) {
    sessionStorage.setItem(`banner-dismissed-${id}`, "1");
    setDismissed((prev) => new Set([...prev, id]));
  }

  const visible = banners.filter((b) => !dismissed.has(b._id));
  if (visible.length === 0) return null;

  return (
    <div className="w-full">
      {visible.map((banner) => (
        <Alert
          key={banner._id}
          className={`rounded-none border-x-0 border-t-0 py-2.5 px-4 animate-slide-down ${severityClasses[banner.severity]}`}
        >
          <AlertDescription className="flex items-center justify-between gap-4 text-sm font-medium">
            <span>{banner.message}</span>
            <button
              onClick={() => dismiss(banner._id)}
              aria-label="Dismiss announcement"
              className="shrink-0 rounded p-0.5 opacity-60 transition-all duration-150 hover:opacity-100 hover:scale-110 active:scale-95 focus-visible:outline focus-visible:outline-2"
            >
              <X className="size-4" />
            </button>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
