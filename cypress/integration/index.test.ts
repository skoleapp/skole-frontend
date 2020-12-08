import { urls } from 'utils';

describe('Home Page Test Suite', () => {
  it('should render', () => {
    cy.visit(urls.home);
    // Should automatically redirect to get started page.
    cy.url().should('include', urls.getStarted);

    // Click on skip login to navigate back to home.
    cy.contains('Skip login').click();
    cy.url().should('include', urls.home);
  });
});
