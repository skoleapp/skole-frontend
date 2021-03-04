import { urls } from 'utils';

describe('Home Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
    cy.graphQlMock({ operationName: 'SuggestionsPreview', fixture: 'suggestionsPreview' }).as(
      'suggestionsPreview',
    );
  });

  it('renders', () => {
    cy.visit(urls.home);
    cy.wait(['@userMe', '@suggestionsPreview']);
    cy.url().should('include', urls.home);
  });
});
