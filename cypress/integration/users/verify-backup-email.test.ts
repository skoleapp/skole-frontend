import { urls } from 'utils';

describe('Verify Backup Email Page Test Suite', () => {
  beforeEach(() => {
    cy.graphQlMock({ operationName: 'UserMe', fixture: 'userMe' }).as('userMe');
  });

  it('renders', () => {
    cy.visit(urls.verifyBackupEmail);
    cy.wait('@userMe');
    cy.url().should('include', urls.verifyBackupEmail);
  });
});
