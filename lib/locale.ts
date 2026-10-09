// Language helpers shared by server and client code.

export type Lang = "en" | "ka";
export const LANGS: Lang[] = ["en", "ka"];
export const LANG_KEY = "vas-lang";

/** A path in the given language: English at /, Georgian under /ka/. */
export function localePath(path: string, lang: Lang) {
  const clean = path.replace(/^\/ka(?=\/|$)/, "") || "/";
  return lang === "ka" ? `/ka${clean === "/" ? "/" : clean}` : clean;
}
