import i18n from 'i18next';
import i18nBackend from "i18next-http-backend";
import { initReactI18next } from 'react-i18next';
import global_en from './translations/en/global.json';
import global_es from './translations/es/global.json';
import global_pt from './translations/pt_br/global.json';



i18n
    .init({
        fallbackLng: 'en',
        lng: 'en',
        interpolation: {
            escapeValue: false
        },
        resources: {
            en: {
                global: global_en
            },
            pt: {
                global: global_pt
            },
            es: {
                global: global_es
            },
        }
    });

export default i18n;
