import "server-only";
import { unstable_cache } from "next/cache";
import type { PortableTextBlock } from "@portabletext/types";

const GOOGLE_TRANSLATE_URL =
  "https://translation.googleapis.com/language/translate/v2";

// Google Translate accepts zh-TW and zh-CN directly
const SUPPORTED_LOCALES = new Set(["zh-TW", "zh-CN"]);

/**
 * Raw fetch — not cached. Call via cachedBatchTranslate instead.
 */
async function batchTranslateRaw(
  texts: string[],
  targetLocale: string
): Promise<string[]> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey || !texts.length) return texts;

  // Filter empties but track original indices so we can reassemble
  const nonempty = texts
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => t.trim().length > 0);

  if (!nonempty.length) return texts;

  try {
    const res = await fetch(`${GOOGLE_TRANSLATE_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: nonempty.map(({ t }) => t),
        source: "en",
        target: targetLocale,
        format: "text",
      }),
    });

    if (!res.ok) return texts;

    const data = (await res.json()) as {
      data: { translations: { translatedText: string }[] };
    };
    const translated = data.data.translations.map((t) => t.translatedText);

    const result = [...texts];
    nonempty.forEach(({ i }, idx) => {
      result[i] = translated[idx] ?? texts[i];
    });
    return result;
  } catch {
    return texts;
  }
}

/**
 * Cached wrapper — keyed by (texts, targetLocale), revalidates every 24 h.
 * Using unstable_cache because cacheComponents is not enabled in next.config.ts.
 */
const cachedBatchTranslate = unstable_cache(
  batchTranslateRaw,
  ["google-translate"],
  { revalidate: 86400 }
);

// ─── Public helpers ───────────────────────────────────────────────────────────

/**
 * Translate a single string. Returns the original for `en` or missing key.
 */
export async function translateString(
  text: string,
  locale: string
): Promise<string> {
  if (!SUPPORTED_LOCALES.has(locale) || !text.trim()) return text;
  const [result] = await cachedBatchTranslate([text], locale);
  return result ?? text;
}

/**
 * Translate an array of strings in one API call.
 */
export async function translateStrings(
  texts: string[],
  locale: string
): Promise<string[]> {
  if (!SUPPORTED_LOCALES.has(locale)) return texts;
  return cachedBatchTranslate(texts, locale);
}

/**
 * Translate all text spans inside a PortableText block array.
 * Preserves marks, markDefs, block structure — only touches `span.text`.
 */
export async function translatePortableText(
  blocks: PortableTextBlock[],
  locale: string
): Promise<PortableTextBlock[]> {
  if (!SUPPORTED_LOCALES.has(locale) || !blocks?.length) return blocks;

  // Collect every span text with its location
  const items: { blockIdx: number; childIdx: number; text: string }[] = [];

  blocks.forEach((block, blockIdx) => {
    if (block._type === "block" && Array.isArray(block.children)) {
      (block.children as { _type: string; text?: string }[]).forEach(
        (child, childIdx) => {
          if (
            child._type === "span" &&
            typeof child.text === "string" &&
            child.text.trim().length > 0
          ) {
            items.push({ blockIdx, childIdx, text: child.text });
          }
        }
      );
    }
  });

  if (!items.length) return blocks;

  const translated = await cachedBatchTranslate(
    items.map((item) => item.text),
    locale
  );

  // Deep-clone so we don't mutate the original Sanity response
  const result = JSON.parse(JSON.stringify(blocks)) as PortableTextBlock[];
  items.forEach((item, idx) => {
    const block = result[item.blockIdx] as unknown as {
      children: { text: string }[];
    };
    if (block.children[item.childIdx]) {
      block.children[item.childIdx].text = translated[idx] ?? item.text;
    }
  });

  return result;
}
