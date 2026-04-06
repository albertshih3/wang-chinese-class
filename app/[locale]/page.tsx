import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { ArrowRight, BookOpen, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Wang Laoshi — Mandarin Chinese Classes",
  description:
    "Small-group Mandarin Chinese classes for K–5 learners. Warm community, experienced teacher, weekend sessions.",
};

const features = [
  {
    icon: Users,
    title: "Small Class Sizes",
    body: "Every child gets individual attention in our intimate group setting.",
  },
  {
    icon: Clock,
    title: "Weekend Sessions",
    body: "Saturday or Sunday mornings, 9 AM–12 PM — one session per week, designed for busy families.",
  },
  {
    icon: BookOpen,
    title: "K–5 Curriculum",
    body: "Age-appropriate lessons that build confidence alongside vocabulary.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50 bg-background">
        {/* Decorative large character — purely visual */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-[-1rem] top-[-1.5rem] select-none font-heading text-[14rem] font-bold leading-none text-primary/5 sm:right-4 sm:text-[18rem]"
        >
          學
        </span>

        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="max-w-2xl">
            <p className="mb-4 font-sans text-sm font-medium uppercase tracking-widest text-primary">
              Mandarin Chinese for Young Learners
            </p>
            <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl [text-wrap:balance]">
              Learning Mandarin<br />
              feels like{" "}
              <span className="text-primary">home</span>.
            </h1>
            <p className="mt-6 max-w-lg font-sans text-lg leading-relaxed text-muted-foreground">
              Small classes, a warm community, and a teacher who takes the time
              to know every child. Weekend sessions for K–5 students.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="gap-2 text-sm font-medium">
                <Link href="/contact">
                  Request a Consultation
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-sm">
                <Link href="/about">Meet Wang Laoshi</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-8 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex flex-col gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="size-5 text-primary" aria-hidden="true" />
              </div>
              <h2 className="font-heading text-base font-semibold text-foreground">{title}</h2>
              <p className="font-sans text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Teacher teaser */}
      <section className="border-t border-border/50 bg-muted/40">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-4 py-14 sm:flex-row sm:items-center sm:gap-10 sm:px-6">
          {/* Placeholder avatar */}
          <div
            role="img"
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary/15 font-heading text-3xl font-bold text-primary"
            aria-label="Teacher photo placeholder"
          >
            王
          </div>
          <div className="flex-1">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-primary">
              Meet the Teacher
            </p>
            <h2 className="mt-1 font-heading text-2xl font-semibold text-foreground">
              Wang Laoshi
            </h2>
            <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
              With years of experience teaching Mandarin to children in the
              local community, Wang Laoshi brings patience, creativity, and
              genuine warmth to every class.
            </p>
            <Link
              href="/about"
              className="mt-3 inline-flex items-center gap-1.5 font-sans text-sm font-medium text-primary hover:underline"
            >
              Learn more <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl [text-wrap:balance]">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-muted-foreground">
            Fill out a short form and we&rsquo;ll reach out within 2 business
            days to answer your questions.
          </p>
          <Button asChild size="lg" className="mt-6 gap-2 text-sm font-medium">
            <Link href="/contact">
              Request a Consultation <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
