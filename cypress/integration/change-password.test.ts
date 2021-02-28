import { urls } from 'utils';

describe('Change Password Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMe' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.changePassword);
    cy.wait('@userMe');
    cy.url().should('include', urls.changePassword);
  });
});
