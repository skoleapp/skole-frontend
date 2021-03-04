import { urls } from 'utils';

describe('Account Settings Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMe' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.accountSettings);
    cy.wait(['@userMe']);
    cy.url().should('include', urls.accountSettings);
  });
});
