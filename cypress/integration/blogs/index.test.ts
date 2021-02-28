import { urls } from 'utils';

describe('Blogs Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.blogs);
    cy.wait(['@userMe']);
    cy.url().should('include', urls.blogs);
  });
});
