declare module 'print-js';
declare module 'lodash.throttle';
declare module 'ramda';
declare module 'markdown/*';
declare module '@cypress/code-coverage/*';

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

declare function sa_event(name: string): void;

interface GraphQlMockParams {
  operationName: string;
  fixture: string;
}

declare namespace Cypress {
  interface Chainable {
    graphQlMock(params: GraphQlMockParams): Chainable;
  }
}
