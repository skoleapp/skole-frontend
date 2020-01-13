import NextI18Next from 'next-i18next';

export const nextI18next = new NextI18Next({
    defaultLanguage: 'en',
    otherLanguages: ['fi', 'sv'],
    localePath: typeof window === 'undefined' ? 'public/locales' : 'locales',
    localeSubpaths: { en: 'en', fi: 'fi', sv: 'sv' },
    fallbackLng: 'en',
});

nextI18next.i18n.languages = ['en', 'fi', 'sv'];

export const includeDefaultNamespaces = (namespaces: string[]): string[] => {
    const defaultNamespaces = [
        'common',
        '_error',
        'languages',
        'forms',
        'validation',
        'notifications',
        'alerts',
        'settings',
        'errors',
    ];

    return defaultNamespaces.concat(namespaces);
};

export const { appWithTranslation, Router, Link, i18n } = nextI18next;
