import { z } from "zod";

export const consultationSchema = z.object({
  parentName: z.string().min(2, "Please enter your name."),
  parentEmail: z.string().email("Please enter a valid email address."),
  parentPhone: z.string().min(7, "Please enter a phone number."),
  childName: z.string().min(1, "Please enter your child's name."),
  childGrade: z.enum(["k", "1", "2", "3", "4", "5", "6plus"] as const, {
    message: "Please select a grade.",
  }),
  message: z.string().max(1000).optional(),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;
