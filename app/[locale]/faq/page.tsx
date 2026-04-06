import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Common questions from families about Wang Laoshi's Mandarin Chinese classes.",
};

// TODO: Phase 3 — replace with Sanity faq documents
const faqs = [
  {
    id: "age-range",
    question: "What ages or grades do you teach?",
    answer:
      "Classes are designed for students in Kindergarten through 5th grade (ages 5–11). If your child falls outside this range, reach out and we'll discuss whether a good fit exists.",
  },
  {
    id: "schedule",
    question: "When are classes held?",
    answer:
      "Classes run on either Saturday or Sunday mornings from 9:00 AM to 12:00 PM — one session per week. Which day depends on your child's group; details are confirmed after enrollment.",
  },
  {
    id: "prior-experience",
    question: "Does my child need prior Mandarin experience?",
    answer:
      "No. We welcome complete beginners as well as heritage learners who have some exposure at home. During the consultation, we'll assess your child's level and place them in the right group.",
  },
  {
    id: "class-size",
    question: "How many students are in each class?",
    answer:
      "Class sizes are intentionally kept very small — around 4 students per group — so every child receives meaningful individual attention and the environment stays warm and focused.",
  },
  {
    id: "enrollment",
    question: "How do I enroll?",
    answer:
      "Start by filling out the consultation request form on the Contact page. Wang Laoshi will follow up within 2 business days to answer your questions and, if it's a good fit, walk you through the next steps.",
  },
  {
    id: "zoom",
    question: "Are classes in-person or online?",
    answer:
      "Classes are held online via Zoom. The recurring meeting link is shared with enrolled families and can be accessed from the Classes page after you sign in.",
  },
  {
    id: "materials",
    question: "What materials or supplies are needed?",
    answer:
      "Students use a textbook that families will need to purchase — it's affordable and a one-time cost. All other materials are provided digitally through Google Classroom. A device with a camera and stable internet connection is required for Zoom.",
  },
  {
    id: "payment",
    question: "How does payment work?",
    answer:
      "Tuition is paid on a per-class basis, giving families maximum flexibility. We currently accept payment via Zelle. Payment details are discussed during the consultation.",
  },
  {
    id: "progress",
    question: "How will I know how my child is progressing?",
    answer:
      "Wang Laoshi provides regular progress updates and is always available to chat. You'll also see your child's work and assignments through Google Classroom. There are no formal grades — the focus is on growth and confidence.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      {/* Page header */}
      <div className="mb-10">
        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-primary">
          FAQ
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
          Everything families want to know before enrolling. Don&rsquo;t see
          your question?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Reach out directly.
          </Link>
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map(({ id, question, answer }) => (
          <AccordionItem key={id} value={id}>
            <AccordionTrigger className="font-heading text-left text-sm font-medium text-foreground">
              {question}
            </AccordionTrigger>
            <AccordionContent className="font-sans text-sm leading-relaxed text-muted-foreground">
              {answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
