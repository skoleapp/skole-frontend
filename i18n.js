const NextI18Next = require('next-i18next').default;

module.exports = new NextI18Next({
  defaultLanguage: 'fi',
  otherLanguages: ['en', 'sv'],
  localePath: 'locales',
  localeSubpaths: {
    en: 'en',
    sv: 'sv'
  }
});
