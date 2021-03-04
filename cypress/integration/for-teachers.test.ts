import { urls } from 'utils';

describe('For Teachers Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.emailSubscription);
    cy.wait('@userMe');
    cy.url().should('include', urls.emailSubscription);
  });
});
