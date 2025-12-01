import { createI18n } from "vue-i18n";
import { es as vuetifyEs, en as vuetifyEn } from "vuetify/locale";
import myEs from "./locales/es.json";
import myEn from "./locales/en.json";

type MessageSchema = typeof myEn;

const messages = {
    es: {
        ...myEs,
        $vuetify: vuetifyEs
    },
    en: {
        ...myEn,
        $vuetify: vuetifyEn
    }
}

const i18n = createI18n<[MessageSchema], "es" | "en">({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  globalInjection: true,
  messages,
});

export default i18n;

declare module "vue-i18n" {
  export interface DefineLocaleMessage extends MessageSchema {}
  export interface DefineDateTimeFormat {}
  export interface DefineNumberFormat {}
}
