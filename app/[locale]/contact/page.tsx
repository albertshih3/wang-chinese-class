import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ConsultationForm } from "@/components/consultation-form";

export const metadata: Metadata = {
  title: "Request a Consultation",
  description:
    "Tell us about your family and Wang Laoshi will be in touch as soon as possible.",
};

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20 animate-fade-up">
      {/* Page header */}
      <div className="mb-10">
        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-primary">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
          {t("subtitleFull")}
        </p>
      </div>

      <ConsultationForm />
    </div>
  );
}
