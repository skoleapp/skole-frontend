import { allLanguages, defaultLanguage, defaultNamespaces } from 'config';
import { NextPage } from 'next';
import DynamicNamespaces from 'next-translate/DynamicNamespaces';
import Link from 'next-translate/Link';
import Router from 'next-translate/Router';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import React from 'react';

const useLangFromRouter = (): string => {
    const { asPath } = useRouter();

    return allLanguages.reduce((result: string, l: string) => {
        if (new RegExp(`(^\/${l}\/)|(^\/${l}$)`).test(asPath)) {
            return l;
        }

        return result;
    }, defaultLanguage);
};

// A wrapper that allows using the `useTranslation` hook in components that are by default wrapped by the `I18nProvider`.
export const withDynamicNamespaces = <T extends {}>(PageComponent: NextPage<T>): NextPage => {
    const WithDynamicNamespaces: NextPage = pageProps => {
        const lang = useLangFromRouter();
        const fallback = <Trans i18nKey="common:loading" />;

        const dynamic = (_: string, ns: string): Promise<{}> =>
            import(`../../locales/${lang}/${ns}.json`).then(m => m.default);

        return (
            <DynamicNamespaces dynamic={dynamic} namespaces={defaultNamespaces} fallback={fallback}>
                <PageComponent {...(pageProps as T)} />
            </DynamicNamespaces>
        );
    };

    return WithDynamicNamespaces;
};

// Re-export only modules that we need with named exports so we can import all translation related modules from one place.
export { useTranslation, Link, Router, Trans };
