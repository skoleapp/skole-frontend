import { urls } from 'utils';

describe('School Page Test Suite', () => {
  const url = urls.school('university-of-turku');

  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
    cy.graphQlMock({ operationName: 'School', fixture: 'school' }).as('school');
    cy.graphQlMock({ operationName: 'Discussion', fixture: 'schoolDiscussion' }).as('discussion');
  });

  it('renders', () => {
    cy.visit(url);
    cy.wait(['@userMe', '@school', '@discussion']);
    cy.url().should('include', url);
  });
});
