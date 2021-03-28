import { urls } from 'utils';

describe('About Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.about);
    cy.wait(['@userMe']);
    cy.url().should('include', urls.about);
  });
});
