import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ExternalLink, Video, BookOpen, Clock, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { sanityFetch } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "Class Schedule",
  description: "Your class schedule, Zoom link, and Google Classroom access.",
};

// TODO: Phase 4 — replace hardcoded schedule with Sanity classSchedule documents
const DAYS = ["Saturday", "Sunday"] as const;

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{ zoomLink, googleClassroomUrl }`;

export default async function ClassesPage() {
  const t = await getTranslations("classes");

  const schedule = [
    { key: "period1", label: t("period1"), start: "9:00 AM", end: "9:40 AM", isBreak: false },
    { key: "break", label: t("break"), start: "9:40 AM", end: "9:50 AM", isBreak: true },
    { key: "period2", label: t("period2"), start: "9:50 AM", end: "10:30 AM", isBreak: false },
  ];

  const days = [
    { key: "Saturday", label: t("saturdayLabel") },
    { key: "Sunday", label: t("sundayLabel") },
  ];

  let zoomLink = "#";
  let classroomLink = "#";
  try {
    const settings = await sanityFetch<{ zoomLink?: string; googleClassroomUrl?: string }>(
      SITE_SETTINGS_QUERY
    );
    zoomLink = settings?.zoomLink ?? "#";
    classroomLink = settings?.googleClassroomUrl ?? "#";
  } catch {
    // Sanity not yet configured — fall back to "#"
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 animate-fade-up">
      {/* Page header */}
      <div className="mb-10">
        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-primary">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 font-sans text-sm text-muted-foreground">
          {t("description")}
        </p>
      </div>

      {/* Quick-access links */}
      <div className="mb-10 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="flex-1 gap-2">
          <a href={zoomLink} target="_blank" rel="noopener noreferrer">
            <Video className="size-4" />
            {t("joinZoom")}
            <ExternalLink className="size-3 opacity-60" />
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="flex-1 gap-2"
        >
          <a href={classroomLink} target="_blank" rel="noopener noreferrer">
            <BookOpen className="size-4" />
            {t("openClassroom")}
            <ExternalLink className="size-3 opacity-60" />
          </a>
        </Button>
      </div>

      <Separator className="mb-10" />

      {/* Schedule cards */}
      <section>
        <div className="mb-5 flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          <h2 className="font-heading text-xl font-semibold text-foreground">
            {t("scheduleHeading")}
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {days.map(({ key, label }) => (
            <Card key={key} className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-3 pt-4 px-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-base font-semibold text-foreground">
                    {label}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {t("weeklyBadge")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-5 py-4">
                <ul className="flex flex-col gap-2.5">
                  {schedule.map((slot) => (
                    <li
                      key={slot.key}
                      className={`flex items-center justify-between gap-4 rounded-md px-3 py-2 text-sm ${
                        slot.isBreak
                          ? "bg-muted/50 text-muted-foreground"
                          : "bg-primary/5"
                      }`}
                    >
                      <span
                        className={`font-medium ${slot.isBreak ? "text-muted-foreground" : "text-foreground"}`}
                      >
                        {slot.label}
                      </span>
                      <span className="flex items-center gap-1.5 tabular-nums text-xs text-muted-foreground">
                        <Clock className="size-3 shrink-0" />
                        {slot.start} – {slot.end}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
