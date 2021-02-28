import { urls } from 'utils';

describe('Add Course Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMe' }).as('userMe');

    cy.graphQlMock({
      operationName: 'CreateCourseAutocompleteData',
      fixture: 'createCourseAutocompleteData',
    }).as('data');
  });

  it('renders', () => {
    cy.visit(urls.addCourse);
    cy.wait(['@userMe', '@data']);
    cy.url().should('include', urls.addCourse);
  });
});
