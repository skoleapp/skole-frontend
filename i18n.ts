import NextI18Next from 'next-i18next';
import { useTranslation as originalUseTranslation } from 'react-i18next';

export const nextI18next = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['fi', 'sv'],
  localePath: 'public/locales',
  localeSubpaths: {
    en: 'en',
    fi: 'fi',
    sv: 'sv'
  }
});

export const includeDefaultNamespaces = (namespaces: string[]) =>
  ['common', '_error'].concat(namespaces);

export const appWithTranslation = nextI18next.appWithTranslation;
export const useTranslation = originalUseTranslation;
