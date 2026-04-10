import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { translateString, translatePortableText } from "@/lib/translate";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "@/i18n/navigation";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { sanityFetch } from "@/lib/sanity";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Common questions from families about Wang Laoshi's Mandarin Chinese classes.",
};

const FAQS_QUERY = `
  *[_type == "faq" && isPublished == true]
  | order(order asc) {
    _id,
    question,
    answer
  }
`;

interface FaqEntry {
  _id: string;
  question: string;
  answer: PortableTextBlock[];
}

// Static fallback used before Sanity is seeded
const FALLBACK_FAQS = [
  {
    _id: "age-range",
    question: "What ages or grades do you teach?",
    answer: null,
    plainAnswer:
      "Classes are designed for students in Kindergarten through 5th grade (ages 5–11). If your child falls outside this range, reach out and we'll discuss whether a good fit exists.",
  },
  {
    _id: "schedule",
    question: "When are classes held?",
    answer: null,
    plainAnswer:
      "Classes run on either Saturday or Sunday mornings from 9:00 AM to 12:00 PM — one session per week. Which day depends on your child's group; details are confirmed after enrollment.",
  },
  {
    _id: "prior-experience",
    question: "Does my child need prior Mandarin experience?",
    answer: null,
    plainAnswer:
      "No. We welcome complete beginners as well as heritage learners who have some exposure at home. During the consultation, we'll assess your child's level and place them in the right group.",
  },
  {
    _id: "class-size",
    question: "How many students are in each class?",
    answer: null,
    plainAnswer:
      "Class sizes are intentionally kept very small — around 4 students per group — so every child receives meaningful individual attention and the environment stays warm and focused.",
  },
  {
    _id: "enrollment",
    question: "How do I enroll?",
    answer: null,
    plainAnswer:
      "Start by filling out the consultation request form on the Contact page. Wang Laoshi will follow up within 2 business days to answer your questions and, if it's a good fit, walk you through the next steps.",
  },
  {
    _id: "zoom",
    question: "Are classes in-person or online?",
    answer: null,
    plainAnswer:
      "Classes are held online via Zoom. The recurring meeting link is shared with enrolled families and can be accessed from the Classes page after you sign in.",
  },
  {
    _id: "materials",
    question: "What materials or supplies are needed?",
    answer: null,
    plainAnswer:
      "Students use a textbook that families will need to purchase — it's affordable and a one-time cost. All other materials are provided digitally through Google Classroom. A device with a camera and stable internet connection is required for Zoom.",
  },
  {
    _id: "payment",
    question: "How does payment work?",
    answer: null,
    plainAnswer:
      "Tuition is paid on a per-class basis, giving families maximum flexibility. We currently accept payment via Zelle. Payment details are discussed during the consultation.",
  },
  {
    _id: "progress",
    question: "How will I know how my child is progressing?",
    answer: null,
    plainAnswer:
      "Wang Laoshi provides regular progress updates and is always available to chat. You'll also see your child's work and assignments through Google Classroom. There are no formal grades — the focus is on growth and confidence.",
  },
];

export default async function FaqPage() {
  const [t, locale] = await Promise.all([
    getTranslations("faq"),
    getLocale(),
  ]);

  let faqs: FaqEntry[] = [];
  let useFallback = false;

  try {
    const raw = await sanityFetch<FaqEntry[]>(FAQS_QUERY);
    if (!raw || raw.length === 0) {
      useFallback = true;
    } else {
      faqs = await Promise.all(
        raw.map(async (entry) => ({
          ...entry,
          question: await translateString(entry.question, locale),
          answer: await translatePortableText(entry.answer, locale),
        }))
      );
    }
  } catch {
    useFallback = true;
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
        <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
          {t("subtitle")}{" "}
          {t("noQuestionPrefix")}{" "}
          <Link href="/contact" className="text-primary hover:underline">
            {t("reachOutLink")}
          </Link>
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {useFallback
          ? FALLBACK_FAQS.map(({ _id, question, plainAnswer }) => (
              <AccordionItem key={_id} value={_id}>
                <AccordionTrigger className="font-heading text-left text-sm font-medium text-foreground">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="font-sans text-sm leading-relaxed text-muted-foreground">
                  {plainAnswer}
                </AccordionContent>
              </AccordionItem>
            ))
          : faqs.map(({ _id, question, answer }) => (
              <AccordionItem key={_id} value={_id}>
                <AccordionTrigger className="font-heading text-left text-sm font-medium text-foreground">
                  {question}
                </AccordionTrigger>
                <AccordionContent className="font-sans text-sm leading-relaxed text-muted-foreground">
                  <PortableText value={answer} />
                </AccordionContent>
              </AccordionItem>
            ))}
      </Accordion>
    </div>
  );
}
