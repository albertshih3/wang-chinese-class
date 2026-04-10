import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import {
  translateString,
  translateStrings,
  translatePortableText,
} from "@/lib/translate";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { sanityFetch, urlFor } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Wendy Wang (王老師) — a certified Mandarin Chinese teacher with 15+ years of experience teaching Traditional and Simplified Chinese to learners of all ages.",
};

const TEACHER_BIO_QUERY = `
  *[_type == "teacherBio"][0] {
    name,
    headshot { asset, alt },
    shortBio,
    fullBio,
    credentials,
    specialties,
    textbooks
  }
`;

interface TeacherBio {
  name: string;
  headshot?: { asset: { _ref: string }; alt?: string } | null;
  shortBio: string;
  fullBio: PortableTextBlock[];
  credentials: string[];
  specialties: string[];
  textbooks: string[];
}

// Static fallback used before Sanity is seeded
const FALLBACK: TeacherBio = {
  name: "Wendy Wang 王老師",
  headshot: null,
  shortBio: "",
  fullBio: [],
  credentials: [
    "Graduated from Ming Chuang College, Taiwan",
    "Teaching Certificate of Teaching Chinese as a Foreign Language — California State University of East Bay, 2008",
    "Instructor at Aletheia University, Taiwan",
    "East Bay Chinese School — 2009–2013",
    "Shou Ren Chinese School — 2013–2019",
    "Online Tutoring — 2020–present",
    "Founded Wang Lao Shi Classroom 王老師教室 (online) — 2020–present",
  ],
  specialties: [
    "Bopomofo (Zhuyin)",
    "Traditional Chinese",
    "PinYin",
    "Simplified Chinese",
    "Cultural Interpretation",
  ],
  textbooks: ["Mei Zhou Chinese", "Living Mandarin", "Chinese Wonderland"],
};

export default async function AboutPage() {
  const [t, locale] = await Promise.all([
    getTranslations("about"),
    getLocale(),
  ]);

  let bio: TeacherBio = FALLBACK;
  try {
    const data = await sanityFetch<TeacherBio | null>(TEACHER_BIO_QUERY);
    if (data) {
      const [shortBio, fullBio, credentials, specialties] = await Promise.all([
        translateString(data.shortBio, locale),
        translatePortableText(data.fullBio, locale),
        translateStrings(data.credentials ?? [], locale),
        translateStrings(data.specialties ?? [], locale),
      ]);
      bio = { ...data, shortBio, fullBio, credentials, specialties };
    }
  } catch {
    // Sanity not yet configured — use fallback
  }

  const [displayName, chineseName] = bio.name.includes("王老師")
    ? [bio.name.replace("王老師", "").trim(), "王老師"]
    : [bio.name, null];

  const headshotUrl = bio.headshot?.asset
    ? urlFor(bio.headshot).width(176).height(176).fit("crop").url()
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 animate-fade-up">
      {/* Page header */}
      <div className="mb-10">
        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-primary">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {displayName}{" "}
          {chineseName && (
            <span className="text-foreground/50 font-normal">{chineseName}</span>
          )}
        </h1>
      </div>

      {/* Bio section */}
      <div className="flex flex-col gap-8 sm:flex-row sm:gap-12">
        {/* Headshot */}
        <div className="shrink-0">
          {headshotUrl ? (
            <Image
              src={headshotUrl}
              alt={bio.headshot?.alt ?? `Photo of ${bio.name}`}
              width={176}
              height={176}
              className="rounded-2xl object-cover sm:h-44 sm:w-44 h-36 w-36"
              priority
            />
          ) : (
            <div
              role="img"
              className="flex h-36 w-36 items-center justify-center rounded-2xl bg-primary/10 font-heading text-5xl font-bold text-primary sm:h-44 sm:w-44"
              aria-label="Teacher photo placeholder"
            >
              王
            </div>
          )}
        </div>

        {/* Bio text */}
        <div className="flex flex-col gap-4 font-sans text-sm leading-relaxed text-foreground/80">
          <h2 className="font-heading text-xl font-semibold text-foreground">
            {t("bioSubheading")}
          </h2>
          {bio.fullBio && bio.fullBio.length > 0 ? (
            <PortableText value={bio.fullBio} />
          ) : (
            <>
              <p>
                Wendy Wang (王老師) has been teaching Mandarin Chinese for over 15
                years across schools and universities in both Taiwan and the Bay
                Area. Originally from Taiwan and a graduate of Ming Chuang College,
                she went on to earn her Teaching Certificate from California State
                University, East Bay in 2008.
              </p>
              <p>
                After teaching at Aletheia University in Taiwan, she brought her
                expertise to the East Bay community, teaching at East Bay Chinese
                School (2009–2013) and Shou Ren Chinese School (2013–2019). In 2020,
                she founded{" "}
                <span className="font-medium text-foreground">
                  Wang Lao Shi Classroom 王老師教室
                </span>
                , her own online teaching program, continuing to serve students
                through live online tutoring and group classes.
              </p>
              <p>
                Wang Laoshi is experienced working in international environments and
                brings a culturally rich perspective to every lesson — helping
                students connect language with the traditions, stories, and
                diversity behind it.
              </p>
            </>
          )}
        </div>
      </div>

      {bio.specialties?.length > 0 && (
        <>
          <Separator className="my-10" />
          <section className="mb-10">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              {t("specialtiesHeading")}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {bio.specialties.map((s) => (
                <Badge key={s} variant="secondary" className="text-xs font-medium">
                  {s}
                </Badge>
              ))}
            </div>
            {bio.textbooks?.length > 0 && (
              <div className="mt-6">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-2">
                  {t("textbooksLabel")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {bio.textbooks.map((b) => (
                    <Badge key={b} variant="outline" className="text-xs">
                      {b}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {bio.credentials?.length > 0 && (
        <>
          <Separator className="my-10" />
          <section>
            <h2 className="font-heading text-xl font-semibold text-foreground">
              {t("educationHeading")}
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {bio.credentials.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="font-sans text-sm leading-relaxed text-foreground/80">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
