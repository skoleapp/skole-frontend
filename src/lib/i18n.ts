import DynamicNamespaces from 'next-translate/DynamicNamespaces';
import I18nProvider from 'next-translate/I18nProvider';
import useTranslation from 'next-translate/useTranslation';

const defaultNamespaces = [
  'common',
  'marketing',
  '_error',
  '404',
  'languages',
  'forms',
  'validation',
  'notifications',
  'tooltips',
  'activity',
  'offline',
  'sharing',
];

type Namespaces = Record<string, string>;

export const loadNamespaces = async (namespaces: string[], lang?: string): Promise<Namespaces> => {
  const totalNamespaces: Namespaces = {};

  for (const ns of [...defaultNamespaces, ...namespaces]) {
    totalNamespaces[ns] = await import(`../../locales/${lang}/${ns}.json`).then((m) => m.default);
  }

  return totalNamespaces;
};

// Re-export only modules that we need with named exports so we can import all translation related modules from one place.
export { useTranslation, DynamicNamespaces, I18nProvider };
