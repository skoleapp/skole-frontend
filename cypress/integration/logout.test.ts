import { urls } from 'utils';

describe('Logout Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMe' }).as('userMe');
    cy.graphQlMock({ operationName: 'GraphQLLogout', fixture: 'logout' }).as('logout');
  });

  it('renders', () => {
    cy.visit(urls.logout);
    cy.wait(['@userMe', '@logout']);
    cy.url().should('include', urls.logout);
  });
});
