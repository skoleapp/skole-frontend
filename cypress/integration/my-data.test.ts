import { urls } from 'utils';

describe('My Data Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMe' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.myData);
    cy.wait('@userMe');
    cy.url().should('include', urls.myData);
  });
});
