import { urls } from 'utils';

describe('Contact Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.contact);
    cy.wait('@userMe');
    cy.url().should('include', urls.contact);
  });
});
