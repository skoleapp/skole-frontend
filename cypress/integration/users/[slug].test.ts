import { urls } from 'utils';

describe('User Profile Page Test Suite', () => {
  const url = urls.user('testuser2');

  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
    cy.graphQlMock({ operationName: 'User', fixture: 'user' }).as('user');
  });

  it('renders', () => {
    cy.visit(url);
    cy.wait(['@userMe', '@user']);
    cy.url().should('include', url);
  });
});
