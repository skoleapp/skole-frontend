import { urls } from 'utils';

describe('Trending Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
    cy.graphQlMock({ operationName: 'Suggestions', fixture: 'suggestions' }).as('suggestions');
  });

  it('renders', () => {
    cy.visit(urls.trending);
    cy.wait(['@userMe', '@suggestions']);
    cy.url().should('include', urls.trending);
  });
});
