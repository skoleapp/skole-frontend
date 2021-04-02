import appWithI18n from 'next-translate/appWithI18n';
import I18nProvider from 'next-translate/I18nProvider';
import useTranslation from 'next-translate/useTranslation';
import { DEFAULT_NAMESPACES } from 'utils';

type Namespaces = Record<string, string>;

export const loadNamespaces = async (
  namespaces: string[],
  locale?: string,
): Promise<Namespaces> => {
  const totalNamespaces: Namespaces = {};

  for (const ns of [...DEFAULT_NAMESPACES, ...namespaces]) {
    totalNamespaces[ns] = await import(`locales/${locale}/${ns}.json`).then((m) => m.default);
  }

  return totalNamespaces;
};

// Re-export only modules that we need with named exports so we can import all translation related modules from one place.
export { appWithI18n, I18nProvider, useTranslation };
