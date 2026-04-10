import { getLocale } from "next-intl/server";
import { sanityFetch } from "@/lib/sanity";
import { translateString } from "@/lib/translate";
import { AnnouncementBannerList } from "./announcement-banner-dismiss";

interface Banner {
  _id: string;
  message: string;
  severity: "info" | "warning" | "success";
}

const BANNERS_QUERY = `
  *[_type == "announcement" && isActive == true && (expiresAt == null || expiresAt > now())]
  | order(_createdAt desc) {
    _id,
    message,
    severity
  }
`;

export async function AnnouncementBanner() {
  let banners: Banner[] = [];
  try {
    banners = await sanityFetch<Banner[]>(BANNERS_QUERY);
  } catch {
    // Sanity not yet configured — fail silently
    return null;
  }

  if (!banners || banners.length === 0) return null;

  const locale = await getLocale();
  const translated = await Promise.all(
    banners.map(async (b) => ({
      ...b,
      message: await translateString(b.message, locale),
    }))
  );

  return <AnnouncementBannerList banners={translated} />;
}
