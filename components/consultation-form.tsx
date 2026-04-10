"use client";

import { useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { consultationSchema, type ConsultationInput } from "@/lib/consultation-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

const GRADE_KEYS = ["k", "1", "2", "3", "4", "5", "6plus"] as const;

type Status = "idle" | "submitting" | "success" | "error";

export function ConsultationForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ConsultationInput>({
    resolver: zodResolver(consultationSchema),
  });

  const onSubmit = async (data: ConsultationInput) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      sendGAEvent("event", "generate_lead", {
        event_category: "Consultation",
        event_label: "Consultation Form Submit",
      });
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30">
        <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
        <AlertTitle className="font-heading text-green-800 dark:text-green-300">
          {t("successTitle")}
        </AlertTitle>
        <AlertDescription className="font-sans text-green-700 dark:text-green-400">
          {t("successMessage")}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      {status === "error" && (
        <Alert role="alert" className="border-destructive/30 bg-destructive/5">
          <AlertCircle className="size-4 text-destructive" aria-hidden="true" />
          <AlertTitle className="font-heading">{t("errorTitle")}</AlertTitle>
          <AlertDescription className="font-sans text-sm">
            {t("errorMessage")}
          </AlertDescription>
        </Alert>
      )}

      {/* Parent info */}
      <fieldset className="flex flex-col gap-5">
        <legend className="font-heading text-base font-semibold text-foreground">
          {t("parentGuardianLegend")}
        </legend>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="parentName">{t("parentNameLabel")}</Label>
          <Input
            id="parentName"
            placeholder={t("parentNamePlaceholder")}
            autoComplete="name"
            aria-invalid={!!errors.parentName}
            aria-describedby={errors.parentName ? "parentName-error" : undefined}
            {...register("parentName")}
          />
          {errors.parentName && (
            <p id="parentName-error" className="font-sans text-xs text-destructive">{errors.parentName.message}</p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="parentEmail">{t("parentEmailLabel")}</Label>
            <Input
              id="parentEmail"
              type="email"
              placeholder={t("parentEmailPlaceholder")}
              autoComplete="email"
              spellCheck={false}
              aria-invalid={!!errors.parentEmail}
              aria-describedby={errors.parentEmail ? "parentEmail-error" : undefined}
              {...register("parentEmail")}
            />
            {errors.parentEmail && (
              <p id="parentEmail-error" className="font-sans text-xs text-destructive">{errors.parentEmail.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="parentPhone">{t("parentPhoneLabel")}</Label>
            <Input
              id="parentPhone"
              type="tel"
              inputMode="tel"
              placeholder={t("parentPhonePlaceholder")}
              autoComplete="tel"
              aria-invalid={!!errors.parentPhone}
              aria-describedby={errors.parentPhone ? "parentPhone-error" : undefined}
              {...register("parentPhone")}
            />
            {errors.parentPhone && (
              <p id="parentPhone-error" className="font-sans text-xs text-destructive">{errors.parentPhone.message}</p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Child info */}
      <fieldset className="flex flex-col gap-5">
        <legend className="font-heading text-base font-semibold text-foreground">
          {t("childLegend")}
        </legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="childName">{t("childNameLabel")}</Label>
            <Input
              id="childName"
              placeholder={t("childNamePlaceholder")}
              aria-invalid={!!errors.childName}
              aria-describedby={errors.childName ? "childName-error" : undefined}
              {...register("childName")}
            />
            {errors.childName && (
              <p id="childName-error" className="font-sans text-xs text-destructive">{errors.childName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="childGrade">{t("childGradeLabel")}</Label>
            <Select onValueChange={(val) => setValue("childGrade", val as ConsultationInput["childGrade"], { shouldValidate: true })}>
              <SelectTrigger
                id="childGrade"
                aria-invalid={!!errors.childGrade}
                aria-describedby={errors.childGrade ? "childGrade-error" : undefined}
              >
                <SelectValue placeholder={t("childGradePlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {GRADE_KEYS.map((key) => (
                  <SelectItem key={key} value={key}>
                    {t(`grades.${key}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.childGrade && (
              <p id="childGrade-error" className="font-sans text-xs text-destructive">{errors.childGrade.message}</p>
            )}
          </div>
        </div>
      </fieldset>

      {/* Optional message */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">
          {t("messageLabel")}{" "}
          <span className="text-muted-foreground">{t("optionalSuffix")}</span>
        </Label>
        <Textarea
          id="message"
          rows={4}
          placeholder={t("messagePlaceholder")}
          {...register("message")}
        />
      </div>

      <Button
        type="submit"
        disabled={status === "submitting"}
        className="self-start gap-2 text-sm font-medium"
        size="lg"
      >
        {status === "submitting" ? t("submitting") : t("submitButton")}
      </Button>
    </form>
  );
}
