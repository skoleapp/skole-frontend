import { urls } from 'utils';

describe('Search Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
    cy.graphQlMock({ operationName: 'Threads', fixture: 'threads' }).as('threads');
  });

  it('renders', () => {
    cy.visit(urls.search);
    cy.wait(['@userMe', '@threads']);
    cy.url().should('include', urls.search);
  });
});
