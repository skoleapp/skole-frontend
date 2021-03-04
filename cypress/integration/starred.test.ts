import { urls } from 'utils';

describe('Starred Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMe' }).as('userMe');
    cy.graphQlMock({ operationName: 'Starred', fixture: 'starred' }).as('starred');
  });

  it('renders', () => {
    cy.visit(urls.starred);
    cy.wait(['@userMe', '@starred']);
    cy.url().should('include', urls.starred);
  });
});
