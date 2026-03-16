export default defineNuxtConfig({
  modules: [
    '../src/module',
    '@nuxtjs/i18n',
  ],

  multiTenancy: {
    defaultTenant: 'acme',
    tenants: {
      acme: {
        domains: ['acme.localhost', 'localhost'],
        layout: 'acme',
        defaultLocale: 'en',
        locales: ['en', 'de'],
        overridesDir: './i18n/overrides/acme',
        meta: {
          brandName: 'Acme Corp',
          primaryColor: '#2563eb',
        },
      },
      globex: {
        domains: ['globex.localhost'],
        layout: 'globex',
        defaultLocale: 'de',
        locales: ['de', 'en'],
        overridesDir: './i18n/overrides/globex',
        meta: {
          brandName: 'Globex GmbH',
          primaryColor: '#16a34a',
        },
      },
    },
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
      { code: 'de', language: 'de-AT', file: 'de.json', name: 'Deutsch' },
    ],
    defaultLocale: 'en',
    langDir: 'locales',
    strategy: 'prefix_except_default',
  },

  devtools: { enabled: true },
})
