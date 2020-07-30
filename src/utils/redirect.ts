import { Router } from 'lib';
import { UrlObject } from 'url';

// Utility that we use for all client-side redirects.
// We must explicitly use Router object provided by i18n client.
// Using this utility prevents us to mistakenly import the wrong Router object.
export const redirect = (location: string | UrlObject): Promise<boolean> => Router.push(location);
