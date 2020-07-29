import NextI18Next from 'next-i18next';
import path from 'path';

const nextI18next = new NextI18Next({
    defaultLanguage: 'en',
    otherLanguages: ['fi', 'sv'],
    localePath: path.resolve('./public/locales'),
    fallbackLng: 'en',
    strictMode: false, // Disable redundant warnings about withTranslation wrapper.
});

nextI18next.i18n.languages = ['en', 'fi', 'sv'];

export const includeDefaultNamespaces = (namespaces: string[]): string[] => {
    const defaultNamespaces = [
        'common',
        '_error',
        '404',
        'languages',
        'forms',
        'validation',
        'notifications',
        'alerts',
        'comments',
        'gdpr',
        'tooltips',
        'activity',
        'loading',
    ];

    return defaultNamespaces.concat(namespaces);
};

export const { appWithTranslation, Router, Link, i18n } = nextI18next;
