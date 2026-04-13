import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { sanityFetch, urlFor } from "@/lib/sanity";
import { translateStrings } from "@/lib/translate";

export const metadata: Metadata = {
  title: "Wang Laoshi — Mandarin Chinese Classes",
  description:
    "Small-group Mandarin Chinese classes for K–5 learners. Warm community, experienced teacher, weekend sessions.",
};

const HOME_PAGE_QUERY = `
  *[_type == "homePage"][0] {
    heroEyebrow,
    headlineMain,
    headlineHighlight,
    heroSubheadline,
    heroCta,
    heroSecondaryButton,
    feature1Title, feature1Body,
    feature2Title, feature2Body,
    feature3Title, feature3Body,
    teacherTeaserLabel,
    teacherName,
    teacherTeaserBody,
    teacherTeaserLinkText,
    ctaBandHeading,
    ctaBandBody,
    ctaBandButton
  }
`;

const TEACHER_HEADSHOT_QUERY = `
  *[_type == "teacherBio"][0] {
    headshot { asset, alt }
  }
`;

interface HomePageData {
  heroEyebrow: string;
  headlineMain: string;
  headlineHighlight: string;
  heroSubheadline: string;
  heroCta: string;
  heroSecondaryButton: string;
  feature1Title: string;
  feature1Body: string;
  feature2Title: string;
  feature2Body: string;
  feature3Title: string;
  feature3Body: string;
  teacherTeaserLabel: string;
  teacherName: string;
  teacherTeaserBody: string;
  teacherTeaserLinkText: string;
  ctaBandHeading: string;
  ctaBandBody: string;
  ctaBandButton: string;
}

interface TeacherHeadshot {
  headshot?: { asset: { _ref: string }; alt?: string } | null;
}

const FALLBACK: HomePageData = {
  heroEyebrow: "Mandarin Chinese for Young Learners",
  headlineMain: "Learning Mandarin feels like",
  headlineHighlight: "home",
  heroSubheadline:
    "Small classes, warm community, and a teacher who makes learning feel like home.",
  heroCta: "Request a Consultation",
  heroSecondaryButton: "Meet the Teacher",
  feature1Title: "Small Class Sizes",
  feature1Body:
    "Every child gets individual attention in our intimate group setting.",
  feature2Title: "Weekend Sessions",
  feature2Body:
    "Saturday or Sunday mornings, 9 AM–12 PM — one session per week, designed for busy families.",
  feature3Title: "K–5 Curriculum",
  feature3Body:
    "Age-appropriate lessons that build confidence alongside vocabulary.",
  teacherTeaserLabel: "Meet the Teacher",
  teacherName: "Wang Laoshi",
  teacherTeaserBody:
    "Small classes, warm community, and a teacher who makes learning feel like home.",
  teacherTeaserLinkText: "Learn more about Wang Laoshi",
  ctaBandHeading: "Ready to get started?",
  ctaBandBody:
    "Fill out a short form and we'll reach out as soon as possible to answer your questions.",
  ctaBandButton: "Request a Consultation",
};

export default async function HomePage() {
  const locale = await getLocale();

  let cms = FALLBACK;
  let headshotUrl: string | null = null;
  let headshotAlt: string | null = null;

  try {
    const [homeResult, bioResult] = await Promise.allSettled([
      sanityFetch<HomePageData | null>(HOME_PAGE_QUERY),
      sanityFetch<TeacherHeadshot | null>(TEACHER_HEADSHOT_QUERY),
    ]);

    if (homeResult.status === "fulfilled" && homeResult.value) {
      const raw = homeResult.value;
      const keys = Object.keys(FALLBACK) as (keyof HomePageData)[];
      const values = keys.map((k) => raw[k] ?? FALLBACK[k]);
      const translated = await translateStrings(values, locale);
      cms = Object.fromEntries(
        keys.map((k, i) => [k, translated[i]])
      ) as unknown as HomePageData;
    }

    if (
      bioResult.status === "fulfilled" &&
      bioResult.value?.headshot?.asset
    ) {
      headshotUrl = urlFor(bioResult.value.headshot)
        .width(480)
        .height(480)
        .fit("crop")
        .url();
      headshotAlt = bioResult.value.headshot.alt ?? "Wang Laoshi";
    }
  } catch {
    // Sanity not yet configured — use fallback
  }

  const features = [
    { num: "01", title: cms.feature1Title, body: cms.feature1Body },
    { num: "02", title: cms.feature2Title, body: cms.feature2Body },
    { num: "03", title: cms.feature3Title, body: cms.feature3Body },
  ];

  const Photo = ({ size }: { size: "sm" | "lg" }) => {
    const lg = size === "lg";
    return headshotUrl ? (
      <Image
        src={headshotUrl}
        alt={headshotAlt ?? "Wang Laoshi"}
        width={lg ? 480 : 96}
        height={lg ? 480 : 96}
        className={
          lg
            ? "relative h-52 w-52 rounded-full object-cover shadow-md ring-4 ring-background lg:h-64 lg:w-64"
            : "h-20 w-20 rounded-full object-cover shadow ring-2 ring-background"
        }
        priority
      />
    ) : (
      <div
        role="img"
        aria-label="Teacher photo placeholder"
        className={
          lg
            ? "relative flex h-52 w-52 items-center justify-center rounded-full bg-primary/15 font-heading text-5xl font-bold text-primary ring-4 ring-background lg:h-64 lg:w-64"
            : "flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 font-heading text-2xl font-bold text-primary ring-2 ring-background"
        }
      >
        王
      </div>
    );
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50 bg-primary/[0.03] animate-fade-in">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid items-center gap-10 sm:grid-cols-[1fr_auto] lg:gap-16">

            {/* Photo — above text on mobile, right column on desktop */}
            <div className="flex items-center justify-start sm:order-last sm:justify-center">
              <div className="relative flex items-center justify-center">
                {/* Terracotta accent circle behind photo */}
                <div className="absolute h-64 w-64 rounded-full bg-primary/10 lg:h-72 lg:w-72" />
                <Photo size="lg" />
              </div>
            </div>

            {/* Content */}
            <div className="max-w-xl">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3.5 py-1 font-sans text-xs font-semibold uppercase tracking-widest text-primary">
                {cms.heroEyebrow}
              </span>
              <h1 className="mt-5 font-heading text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl [text-wrap:balance]">
                {cms.headlineMain}{" "}
                <span className="font-bold text-primary">{cms.headlineHighlight}</span>.
              </h1>
              <p className="mt-5 max-w-lg font-sans text-lg leading-relaxed text-muted-foreground">
                {cms.heroSubheadline}
              </p>
              <div className="mt-7 flex flex-col items-start gap-3">
                <Button asChild size="lg" className="gap-2 text-sm font-medium">
                  <Link href="/contact">
                    {cms.heroCta}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {cms.heroSecondaryButton}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features — numbered editorial grid */}
      <section className="animate-fade-in">
        <div className="mx-auto max-w-5xl">
          <div className="grid divide-y divide-border/60 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {features.map(({ num, title, body }) => (
              <div key={num} className="flex flex-col gap-3 px-6 py-10 sm:px-8 sm:py-12">
                <span className="font-sans text-3xl font-bold tabular-nums text-primary/25">
                  {num}
                </span>
                <h2 className="font-heading text-base font-semibold text-foreground">
                  {title}
                </h2>
                <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher teaser */}
      <section className="border-t border-border/50 bg-muted/40">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-4 py-14 sm:flex-row sm:items-center sm:gap-10 sm:px-6">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-primary/10 scale-110" />
            <Photo size="sm" />
          </div>
          <div className="flex-1">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-primary">
              {cms.teacherTeaserLabel}
            </p>
            <h2 className="mt-1 font-heading text-2xl font-semibold text-foreground">
              {cms.teacherName}
            </h2>
            <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
              {cms.teacherTeaserBody}
            </p>
            <Link
              href="/about"
              className="mt-3 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-primary hover:underline"
            >
              {cms.teacherTeaserLinkText}{" "}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl [text-wrap:balance]">
            {cms.ctaBandHeading}
          </h2>
          <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
            {cms.ctaBandBody}
          </p>
          <Button asChild size="lg" className="mt-6 gap-2 text-sm font-medium">
            <Link href="/contact">
              {cms.ctaBandButton} <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
