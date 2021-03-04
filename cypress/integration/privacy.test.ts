import { urls } from 'utils';

describe('Privacy Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.privacy);
    cy.wait('@userMe');
    cy.url().should('include', urls.privacy);
  });
});
