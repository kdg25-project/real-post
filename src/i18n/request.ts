import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

// Can be imported from a shared config
export const locales = ["en", "ja", "zh-cn", "zh-tw", "ko"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async () => {
  // Get locale from header (set by middleware) or cookie
  const headersList = await headers();
  let locale = headersList.get("x-locale");

  if (!locale) {
    const cookieStore = await cookies();
    locale = cookieStore.get("lang")?.value || "en";
  }

  // Ensure that a valid locale is used
  if (!locales.includes(locale as Locale)) {
    locale = "en";
  }

  return {
    locale,
    messages: (await import(`../../i18n/${locale}.json`)).default,
  };
});
