import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "ja",

    lng: "ja", // Default language

    resources: {
      ja: {
        translation: {
          welcome: "ようこそ",
          login: "ログイン",
          home: "ホーム",
        },
      },

      en: {
        translation: {
          welcome: "Welcome",
          login: "Login",
          home: "Home",
        },
      },
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;