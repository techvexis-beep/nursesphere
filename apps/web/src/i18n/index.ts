import en from './locales/en.json';
import es from './locales/es.json';

export type Locale = 'en' | 'es';

export const locales: Locale[] = ['en', 'es'];

const translations: Record<Locale, typeof en> = { en, es };

export function getTranslations(locale: Locale = 'en') {
  return translations[locale] || translations.en;
}

export function t(locale: Locale, key: string, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value: unknown = translations[locale] || translations.en;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }

  if (typeof value !== 'string') return key;

  if (params) {
    return Object.entries(params).reduce(
      (str, [param, val]) => str.replace(new RegExp(`{{${param}}}`, 'g'), String(val)),
      value,
    );
  }

  return value;
}
