import { urls } from 'utils';

describe('Badges Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
    cy.graphQlMock({ operationName: 'Badges', fixture: 'badges' }).as('badges');
  });

  it('renders', () => {
    cy.visit(urls.badges);
    cy.wait(['@userMe', '@badges']);
    cy.url().should('include', urls.badges);
  });
});
