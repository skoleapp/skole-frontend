import { urls } from 'utils';

describe('Login Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
  });

  it('should render', () => {
    cy.visit(urls.login);
    cy.wait('@userMe');
    cy.url().should('include', urls.login);
  });
});
