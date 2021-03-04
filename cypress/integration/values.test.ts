import { urls } from 'utils';

describe('Values Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.values);
    cy.wait('@userMe');
    cy.url().should('include', urls.values);
  });
});
