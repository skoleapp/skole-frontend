const NextI18Next = require('next-i18next').default;

const languages = ['fi', 'en', 'sv'];

const options = {
  defaultLanguage: 'fi',
  otherLanguages: ['en', 'sv'],
  localePath: 'locales',
  localeSubpaths: {
    en: 'en',
    sv: 'sv'
  }
};

const NextI18NextInstance = new NextI18Next(options);

NextI18NextInstance.i18n.languages = languages;

module.exports = NextI18NextInstance;
