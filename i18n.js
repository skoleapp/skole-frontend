module.exports = {
  locales: ['en', 'fi', 'sv'],
  defaultLocale: 'en',
  loader: false,
  loadLocaleFrom: (locale, namespace) =>
    import(`./locales/${locale}/${namespace}`).then((m) => m.default),
};
