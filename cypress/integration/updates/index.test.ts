import { urls } from 'utils';

describe('Updates Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.updates);
    cy.wait(['@userMe']);
    cy.url().should('include', urls.updates);
  });
});
