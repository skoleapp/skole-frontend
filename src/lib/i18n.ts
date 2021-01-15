import I18nProvider from 'next-translate/I18nProvider';
import useTranslation from 'next-translate/useTranslation';
import { DEFAULT_NAMESPACES } from 'utils';

type Namespaces = Record<string, string>;

export const loadNamespaces = async (namespaces: string[], lang?: string): Promise<Namespaces> => {
  const totalNamespaces: Namespaces = {};

  for (const ns of [...DEFAULT_NAMESPACES, ...namespaces]) {
    totalNamespaces[ns] = await import(`locales/${lang}/${ns}.json`).then((m) => m.default);
  }

  return totalNamespaces;
};

// Re-export only modules that we need with named exports so we can import all translation related modules from one place.
export { I18nProvider, useTranslation };
