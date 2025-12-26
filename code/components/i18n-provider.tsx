"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";
import { ReactNode, useEffect, useState } from "react";

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        },
        // Mock translations for now to avoid 404s if files don't exist
        resources: {
            en: {
                translation: {
                    "welcome": "Welcome to LocalMarket",
                    "products": "Products",
                    "cart": "Cart"
                }
            },
            fr: {
                translation: {
                    "welcome": "Bienvenue à LocalMarket",
                    "products": "Produits",
                    "cart": "Panier"
                }
            }
        }
    });

export default function I18nProvider({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <>{children}</>;

    return <>{children}</>;
}
