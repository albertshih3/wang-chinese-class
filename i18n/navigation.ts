import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Use these instead of next/link and next/navigation in UI components.
// They automatically prepend the active locale prefix so navigation never
// drops the user back to the default (English) locale mid-session.
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
