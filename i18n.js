const NextI18Next = require('next-i18next').default;

const languages = ['en', 'sv', 'fi'];

const options = {
  defaultLanguage: 'en',
  otherLanguages: ['sv', 'fi'],
  localePath: 'locales',
  localeSubpaths: {
    en: 'en',
    sv: 'sv',
    fi: 'fi'
  }
};

const NextI18NextInstance = new NextI18Next(options);

NextI18NextInstance.i18n.languages = languages;

module.exports = NextI18NextInstance;
