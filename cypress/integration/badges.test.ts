import { urls } from 'utils';

describe('Badges Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.badges);
    cy.wait(['@userMe']);
    cy.url().should('include', urls.badges);
  });
});
