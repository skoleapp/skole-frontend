import { urls } from 'utils';

describe('Guidelines Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.guidelines);
    cy.wait(['@userMe']);
    cy.url().should('include', urls.guidelines);
  });
});
