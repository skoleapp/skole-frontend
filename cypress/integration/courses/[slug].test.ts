import { urls } from 'utils';

describe('Course Page Test Suite', () => {
  const url = urls.course('test-engineering-course-1-test0001');

  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMeAnonymous' }).as('userMe');
    cy.graphQlMock({ operationName: 'Course', fixture: 'course' }).as('course');
    cy.graphQlMock({ operationName: 'Discussion', fixture: 'courseDiscussion' }).as('discussion');
  });

  it('renders', () => {
    cy.visit(url);
    cy.wait(['@userMe', '@course', '@discussion']);
    cy.url().should('include', url);
  });
});
