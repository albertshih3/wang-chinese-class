import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

// TODO: Phase 2 — replace with Clerk <SignIn /> component
export default function SignInPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-20 text-center sm:px-6">
      <p className="font-sans text-xs font-semibold uppercase tracking-widest text-primary">
        Account
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold text-foreground">
        Sign In
      </h1>
      <p className="mt-3 font-sans text-sm text-muted-foreground">
        Sign-in is coming soon. Enrolled families will receive an invitation
        link by email.
      </p>
    </div>
  );
}
