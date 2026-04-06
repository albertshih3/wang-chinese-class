import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { consultationSchema } from "@/lib/consultation-schema";

// Instantiated lazily inside the handler so build doesn't fail without env vars

// Simple in-memory rate limiting: 1 submission per IP per 10 minutes.
// Note: relies on x-forwarded-for set by a trusted proxy (Vercel). Not suitable
// for direct/untrusted deployments where that header can be spoofed.
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  // Prune all expired entries to prevent unbounded map growth
  for (const [key, timestamp] of rateLimitMap) {
    if (now - timestamp >= RATE_LIMIT_MS) rateLimitMap.delete(key);
  }
  const last = rateLimitMap.get(ip);
  if (last !== undefined && now - last < RATE_LIMIT_MS) return false;
  rateLimitMap.set(ip, now);
  return true;
}

const GRADE_LABELS: Record<string, string> = {
  k: "Kindergarten",
  "1": "1st Grade",
  "2": "2nd Grade",
  "3": "3rd Grade",
  "4": "4th Grade",
  "5": "5th Grade",
  "6plus": "6th Grade or above",
};

export async function POST(req: NextRequest) {
  // Rate limit by IP (x-forwarded-for trusted from Vercel's edge proxy)
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  if (!ip) {
    return NextResponse.json({ error: "Unable to identify request origin." }, { status: 400 });
  }
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait 10 minutes before trying again." },
      { status: 429 }
    );
  }

  // Parse + validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = consultationSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: result.error.flatten() },
      { status: 400 }
    );
  }

  const { parentName, parentEmail, parentPhone, childName, childGrade, message } =
    result.data;

  const gradeLabel = GRADE_LABELS[childGrade] ?? childGrade;
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const stakeholderEmail = process.env.STAKEHOLDER_EMAIL;
  const fromAddress = process.env.RESEND_FROM_ADDRESS;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!stakeholderEmail || !fromAddress || !resendApiKey) {
    console.error("Missing STAKEHOLDER_EMAIL, RESEND_FROM_ADDRESS, or RESEND_API_KEY env vars");
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  const resend = new Resend(resendApiKey);

  try {
    await resend.emails.send({
      from: fromAddress,
      to: stakeholderEmail,
      replyTo: parentEmail,
      subject: `New Consultation Request – ${parentName}`,
      text: `
A new consultation request was submitted on ${dateStr} at ${timeStr}.

PARENT INFORMATION
  Name:   ${parentName}
  Email:  ${parentEmail}
  Phone:  ${parentPhone}

CHILD INFORMATION
  Name:         ${childName}
  Grade Level:  ${gradeLabel}

MESSAGE
  ${message?.trim() || "No message provided."}

---
Reply directly to this email to contact the family.
Reply-To is set to ${parentEmail}.
      `.trim(),
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
