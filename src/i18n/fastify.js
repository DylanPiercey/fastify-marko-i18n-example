import plugin from "fastify-plugin";
import Negotiator from "negotiator";
import { AsyncLocalStorage } from "async_hooks";

const locales = Object.fromEntries(
  Object.entries(import.meta.glob("./locales/*.js", { eager: true })).map(
    ([key, value]) => {
      const [, locale] = key.match(/\.\/locales\/(.+)\.js$/);
      return [locale, value];
    }
  )
);
const languages = Object.keys(locales);

/**
 * A Fastify plugin that sets the language based on the Accept-Language header
 * and stores it in our languageStore.
 */
const languageStore = new AsyncLocalStorage();
export default plugin(async (app) => {
  app.addHook("onRequest", (request, _reply, done) => {
    languageStore.run(new Negotiator(request.raw).language(languages), done);
  });
});

/**
 * Returns the current translations object.
 */
export function getLocale() {
  return locales[languageStore.getStore() || "en"];
}

/**
 * Generates a script tag that can be used to set the i18n object on the client.
 */
export function getScript() {
  const locale = getLocale();
  let script = `$i18n={`;
  let sep = "";
  for (const key in locale) {
    const val = locale[key];
    script += `${sep + key}:`;
    sep = ",";
    switch (typeof val) {
      case "function":
        script += val.toString();
        break;
      case "string":
        script += JSON.stringify(val);
        break;
    }
  }
  script += "}";
  return script;
}
