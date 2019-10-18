const PRODUCTION = false;

export const API_URL = PRODUCTION
  ? 'https://api.skole.fi/graphql/'
  : 'http://localhost:8000/graphql/';

export const APP_NAME = 'skole';
