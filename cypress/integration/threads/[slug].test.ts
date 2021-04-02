import { urls } from 'utils';

describe('Thread Page Test Suite', () => {
  const url = urls.thread('test-thread-1');

  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
    cy.graphQlMock({ operationName: 'Thread', fixture: 'thread' }).as('thread');
  });

  it('renders', () => {
    cy.visit(url);
    cy.wait(['@userMe', '@thread']);
    cy.url().should('include', url);
  });
});
