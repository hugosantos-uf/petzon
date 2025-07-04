export default {
  locales: ['pt', 'en', 'es'],
  defaultLocale: 'pt',
  messages: {
    pt: () => import('./messages/pt.json'),
    en: () => import('./messages/en.json'),
    es: () => import('./messages/es.json'),
  }
};