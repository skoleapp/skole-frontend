import { urls } from 'utils';

describe('Edit Profile Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMe' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.editProfile);
    cy.wait('@userMe');
    cy.url().should('include', urls.editProfile);
  });
});
