import { urls } from 'utils';

describe('Ask Question Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.askQuestion);
    cy.wait(['@userMe']);
    cy.url().should('include', urls.askQuestion);
  });
});
