/// <reference types="cypress" />

import '@cypress/code-coverage/support';

// A custom command that allows intercepting any GraphQL query or mutation and responding to it with a fixture.
Cypress.Commands.add('graphQlMock', ({ operationName, fixture }) =>
  cy.intercept('POST', 'graphql', (req) => {
    if (req.body.operationName === operationName) {
      req.reply({ fixture });
    }
  }),
);
