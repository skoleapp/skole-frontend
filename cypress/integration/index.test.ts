import { urls } from 'utils';

describe('Landing Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.index);
    cy.wait('@userMe');
    cy.url().should('include', urls.index);
  });
});
