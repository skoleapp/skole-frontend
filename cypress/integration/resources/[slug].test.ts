import { urls } from 'utils';

describe('Resource Page Test Suite', () => {
  const url = urls.resource('sample-exam-1-2012-12-12');

  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
    cy.graphQlMock({ operationName: 'Resource', fixture: 'resource' }).as('resource');
    cy.graphQlMock({ operationName: 'Discussion', fixture: 'resourceDiscussion' }).as('discussion');
  });

  it('renders', () => {
    cy.visit(url);
    cy.wait(['@userMe', '@resource', '@discussion']);
    cy.url().should('include', url);
  });
});
