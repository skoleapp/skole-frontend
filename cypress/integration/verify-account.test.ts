import { urls } from 'utils';

describe('Verify Account Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMe' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.verifyAccount);
    cy.wait('@userMe');
    cy.url().should('include', urls.verifyAccount);
  });
});
