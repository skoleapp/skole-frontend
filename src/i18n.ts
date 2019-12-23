import NextI18Next from 'next-i18next';

export const nextI18next = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['fi', 'sv'],
  localePath: typeof window === 'undefined' ? 'public/locales' : 'locales',
  localeSubpaths: { en: 'en', fi: 'fi', sv: 'sv' },
  fallbackLng: 'en'
});

nextI18next.i18n.languages = ['en', 'fi', 'sv'];

export const includeDefaultNamespaces = (namespaces: string[]) =>
  ['common', '_error'].concat(namespaces);

export const { appWithTranslation, Router, Link } = nextI18next;
