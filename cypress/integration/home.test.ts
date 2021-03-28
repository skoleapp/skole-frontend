import { urls } from 'utils';

describe('Home Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
    cy.graphQlMock({ operationName: 'Threads', fixture: 'threads' }).as('threads');
  });

  it('renders', () => {
    cy.visit(urls.home);
    cy.wait(['@userMe', '@threads']);
    cy.url().should('include', urls.home);
  });
});
