import type { Metadata } from "next";
import { ConsultationForm } from "@/components/consultation-form";

export const metadata: Metadata = {
  title: "Request a Consultation",
  description:
    "Tell us about your family and Wang Laoshi will be in touch within 2 business days.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 sm:py-20">
      {/* Page header */}
      <div className="mb-10">
        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-primary">
          Get in touch
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Request a Consultation
        </h1>
        <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">
          Fill out the form below and Wang Laoshi will be in touch within 2
          business days. No commitment required.
        </p>
      </div>

      <ConsultationForm />
    </div>
  );
}
