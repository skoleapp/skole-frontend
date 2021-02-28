import { urls } from 'utils';

describe('Search Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
    cy.graphQlMock({ operationName: 'Courses', fixture: 'courses' }).as('courses');
  });

  it('renders', () => {
    cy.visit(urls.search);
    cy.wait(['@userMe', '@courses']);
    cy.url().should('include', urls.search);
  });
});
