import { urls } from 'utils';

describe('Home Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
    cy.graphQlMock({ operationName: 'TrendingComments', fixture: 'trendingComments' }).as(
      'trendingComments',
    );
  });

  it('renders', () => {
    cy.visit(urls.home);
    cy.wait(['@userMe', '@trendingComments']);
    cy.url().should('include', urls.home);
  });
});
