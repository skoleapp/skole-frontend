import { urls } from 'utils';

describe('Delete Account Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMe' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.deleteAccount);
    cy.wait('@userMe');
    cy.url().should('include', urls.deleteAccount);
  });
});
