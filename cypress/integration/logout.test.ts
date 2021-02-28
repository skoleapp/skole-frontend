import { urls } from 'utils';

describe('Logout Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMe' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.logout);
    cy.wait('@userMe');
    cy.url().should('include', urls.logout);
  });
});
