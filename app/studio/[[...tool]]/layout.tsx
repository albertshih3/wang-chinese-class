import { metadata as studioMetadata, viewport as studioViewport } from "next-sanity/studio";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata = {
  ...studioMetadata,
  title: "Content Studio",
};

export const viewport = {
  ...studioViewport,
};

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
  if (role !== "admin") {
    // If you're seeing this in dev, the Clerk JWT template is missing the metadata claim.
    // Go to Clerk Dashboard → Configure → Sessions → Customize session token and add:
    // { "metadata": "{{user.public_metadata}}" }
    redirect("/?studio-access=denied");
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
