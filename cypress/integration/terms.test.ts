import { urls } from 'utils';

describe('Terms Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.terms);
    cy.wait('@userMe');
    cy.url().should('include', urls.terms);
  });
});
