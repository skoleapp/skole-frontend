import NextI18Next from 'next-i18next';
import path from 'path';
import { useTranslation as _useTranslation, UseTranslationResponse } from 'react-i18next';

const nextI18next = new NextI18Next({
    defaultLanguage: 'en',
    otherLanguages: ['fi', 'sv'],
    localePath: path.resolve('./public/locales'),
    fallbackLng: 'en',
    strictMode: false, // Disable warnings about withTranslation wrapper.
    shallowRender: true, // Avoid triggering `getInitialProps` when changing language.
});

export const includeDefaultNamespaces = (namespaces: string[]): string[] => {
    const defaultNamespaces = [
        'common',
        '_error',
        '404',
        'languages',
        'forms',
        'validation',
        'notifications',
        'comments',
        // 'gdpr', // TODO: Uncomment this when we enable GDPR.
        'tooltips',
        'activity',
        'offline',
    ];

    return defaultNamespaces.concat(namespaces);
};

interface UseTranslation extends Omit<UseTranslationResponse, 't'> {
    t: (key: string, options?: { [key: string]: JSX.Element | string | number }) => string;
}

// A custom hook that we use instead of the original ´react-i18next´ hook.
// It does nothing else than return the original hook and we do it for two reasons:
// 1. We must rewrite the typings for the t-function so that it returns a string (which it in fact does) since most prop interfaces require it.
// 2. ´react-i18next´ is a peer dependency and we cannot auto-import it (at least on VSCode) unlike this custom hook.
export const useTranslation = (): UseTranslation => _useTranslation();
export const { appWithTranslation, Router, Link, i18n } = nextI18next;
