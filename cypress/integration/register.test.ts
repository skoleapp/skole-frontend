import { urls } from 'utils';

describe('Register Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.register);
    cy.wait('@userMe');
    cy.url().should('include', urls.register);
  });
});
