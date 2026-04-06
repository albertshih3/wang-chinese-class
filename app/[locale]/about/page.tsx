import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Wang Laoshi — a dedicated Mandarin Chinese teacher serving K–5 learners in our community.",
};

// TODO: Phase 3 — replace static content with Sanity teacherBio document
const credentials = [
  "Bachelor's degree in Chinese Language Education",
  "10+ years teaching Mandarin to children",
  "Experience with diverse learning styles and paces",
  "Native Mandarin speaker",
  "Trained in communicative language teaching methodology",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      {/* Page header */}
      <div className="mb-10">
        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-primary">
          About
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Wang Laoshi
        </h1>
      </div>

      {/* Bio section */}
      <div className="flex flex-col gap-8 sm:flex-row sm:gap-12">
        {/* Placeholder headshot */}
        <div className="shrink-0">
          <div
            role="img"
            className="flex h-36 w-36 items-center justify-center rounded-2xl bg-primary/10 font-heading text-5xl font-bold text-primary sm:h-44 sm:w-44"
            aria-label="Teacher photo placeholder"
          >
            王
          </div>
        </div>

        {/* Bio text */}
        <div className="flex flex-col gap-4 font-sans text-sm leading-relaxed text-foreground/80">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Teaching with Heart
          </h2>
          <p>
            Wang Laoshi has been teaching Mandarin Chinese to young learners in
            the local community for over a decade. Her classes are known for
            their warm atmosphere, patient approach, and the genuine connections
            she builds with every family.
          </p>
          <p>
            She believes that language learning is most powerful when it feels
            natural — woven into stories, songs, and real conversations rather
            than drills and rote memorization. Her students don't just learn to
            speak Mandarin; they learn to feel comfortable in it.
          </p>
          <p>
            Originally from Taiwan, Wang Laoshi brings an authentic cultural
            perspective to every lesson, helping students connect language with
            the rich traditions and stories behind it.
          </p>
        </div>
      </div>

      <Separator className="my-10" />

      {/* Teaching philosophy */}
      <section className="mb-10">
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Teaching Philosophy
        </h2>
        <p className="mt-4 font-sans text-sm leading-relaxed text-foreground/80">
          Every child learns differently. Wang Laoshi tailors her approach to
          meet each student where they are — whether they're complete beginners
          or heritage learners reconnecting with the language. Small class sizes
          make this possible, and she keeps it that way intentionally.
        </p>
        <p className="mt-3 font-sans text-sm leading-relaxed text-foreground/80">
          Parents are partners in the process. Regular communication, honest
          progress updates, and an open-door policy for questions are
          cornerstones of how she runs her classes.
        </p>
      </section>

      <Separator className="my-10" />

      {/* Credentials */}
      <section>
        <h2 className="font-heading text-xl font-semibold text-foreground">
          Credentials &amp; Experience
        </h2>
        <ul className="mt-5 flex flex-col gap-3">
          {credentials.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
              <span className="font-sans text-sm leading-relaxed text-foreground/80">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
