declare module 'print-js';
declare module 'lodash.throttle';
declare module 'ramda';
declare module 'next-translate/*';
declare module 'draft-js-export-markdown';
declare module 'draft-js-import-markdown';
declare module 'markdown/*';

declare namespace window {
  interface ShareData {
    title?: string;
    text?: string;
    url?: string;
  }

  interface ShareNavigator extends Omit<Navigator, 'share'> {
    share?: (data?: ShareData) => Promise<void>;
  }

  interface ShareNavigatorWindow extends Omit<Window, 'navigator'> {
    navigator: ShareNavigator;
  }
}
