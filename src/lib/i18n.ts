import useTranslation from 'next-translate/useTranslation';
import I18nProvider from 'next-translate/I18nProvider';

// Re-export only modules that we need with named exports so we can import all translation related modules from one place.
export { useTranslation, I18nProvider };
