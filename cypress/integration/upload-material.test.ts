import { urls } from 'utils';

describe('Upload Material Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMe' }).as('userMe');

    cy.graphQlMock({
      operationName: 'CreateResourceAutocompleteData',
      fixture: 'createResourceAutocompleteData',
    }).as('data');
  });

  it('renders', () => {
    cy.visit(urls.uploadMaterial);
    cy.wait(['@userMe', '@data']);
    cy.url().should('include', urls.uploadMaterial);
  });
});
