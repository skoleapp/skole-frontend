import { urls } from 'utils';

describe('Activity Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMe' }).as('userMe');
    cy.graphQlMock({ operationName: 'Activities', fixture: 'activities' }).as('activities');
  });

  it('renders', () => {
    cy.visit(urls.activity);
    cy.wait(['@userMe', '@activities']);
    cy.url().should('include', urls.activity);
  });
});
