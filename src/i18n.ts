import NextI18Next from 'next-i18next';

export const nextI18next = new NextI18Next({
    defaultLanguage: 'en',
    otherLanguages: ['fi', 'sv'],
    localePath: typeof window === 'undefined' ? 'public/locales' : 'locales',
    fallbackLng: 'en',
    strictMode: false,
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
    ];

    return defaultNamespaces.concat(namespaces);
};

export const { appWithTranslation, Router, Link, i18n } = nextI18next;
