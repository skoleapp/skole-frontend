import { urls } from 'utils';

describe('Reset Password Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.resetPassword);
    cy.wait('@userMe');
    cy.url().should('include', urls.resetPassword);
  });
});
