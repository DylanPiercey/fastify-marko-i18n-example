import tmpl from "templite";

const getLocale = typeof document === "object" ? () => window.$i18n : (await import("./fastify")).getLocale;

/**
 * Translates a key into the current language.
 */
 export function t(key, data) {
  const value = getLocale()?.[key];
  switch (typeof value) {
    case "function":
      return value(data);
    case "string":
      return tmpl(value, data);
  }
}
